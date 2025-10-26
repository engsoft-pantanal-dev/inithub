from src.llms import LLMManager, set_session_llm
from src.workflow.chain import chain
from src.config import logger
from src.schemas.agent import State
from src.services.session_manager import session_manager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.staticfiles import StaticFiles
from typing import cast

import json
import logging

app = FastAPI()

logger.setup_logging()

llm_manager = LLMManager()
ws_logger = logging.getLogger("app")


@app.websocket("/ws/v1/agent")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: str = Query(default=None),
    session_id: str = Query(default=None),
):
    await websocket.accept()

    if not user_id:
        user_id = f"anonymous-{id(websocket)}"
        ws_logger.info(f"🔓 Anonymous user connected: {user_id}")

    if session_id:
        state = session_manager.get_state(session_id)
        if not state or state.get("user_id") != user_id:
            session_id = session_manager.create_session(user_id)
            state = session_manager.get_state(session_id)
    else:
        session_id = session_manager.create_session(user_id)
        state = session_manager.get_state(session_id)
        session_llm = llm_manager.get_llm()
        set_session_llm(session_llm)
        ws_logger.info(
            f"🔄 New LLM assigned for session {session_id}: {session_llm.model_name}"
        )

    if not state:
        ws_logger.error(f"❌ Failed to create/get state for user {user_id}")
        await websocket.close()
        return

    ws_logger.info(
        f"✅ User {user_id} connected with session {session_id} (messages: {len(state.get('messages', []))})"
    )

    try:
        while True:
            try:
                data = await websocket.receive_text()
                payload = json.loads(data)
                user_msg = payload.get("message", "")
            except WebSocketDisconnect:
                ws_logger.info(
                    f"🔌 User {user_id} disconnected from session {session_id}"
                )
                break
            except Exception as e:
                ws_logger.error(f"❌ WebSocket error for user {user_id}: {e}")
                break

            state["messages"].append({"role": "user", "content": user_msg})

            updated_state = chain.invoke(state)

            if isinstance(updated_state, dict):
                state = cast(State, updated_state)
                state["user_id"] = user_id
                state["session_id"] = session_id

            session_manager.update_state(session_id, state)

            if state.get("messages"):
                last_msg = state["messages"][-1]
                initiative = state.get("initiative")
                publish_requested = state.get("publish_requested", False)

                response_data = {
                    "message": last_msg.content,
                    "initiative": initiative.dict() if initiative else None,
                    "session_id": session_id,
                    "user_id": user_id,
                    "publish_requested": publish_requested,
                }

                try:
                    await websocket.send_text(json.dumps(response_data))
                    ws_logger.debug(
                        f"   ✅ Message sent to user {user_id} (publish_requested={publish_requested})"
                    )
                except Exception as e:
                    ws_logger.error(
                        f"   ❌ Failed to send message to user {user_id}: {e}"
                    )
                    break
    finally:
        ws_logger.info(
            f"🧹 Connection closed for session {session_id}, cleaning up expired sessions..."
        )
        cleaned = session_manager.cleanup_expired_sessions()
        if cleaned > 0:
            ws_logger.info(f"🧹 Cleaned up {cleaned} expired session(s)")
        ws_logger.info(f"📊 Active sessions: {session_manager.get_session_count()}")


app.mount("/", StaticFiles(directory="ui", html=True), name="ui")
