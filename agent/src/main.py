from src.workflow.chain import chain
from src.config import logger
from src.schemas.agent import State
from src.services.session_manager import session_manager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.staticfiles import StaticFiles
from typing import cast

import json

app = FastAPI()

logger.setup_logging()


@app.websocket("/ws/v1/agent")
async def websocket_endpoint(
    websocket: WebSocket,
    user_id: str = Query(default="anonymous"),
    session_id: str = Query(None),
):
    await websocket.accept()

    if not user_id or user_id == "anonymous":
        user_id = f"anonymous-{id(websocket)}"

    if session_id:
        state = session_manager.get_state(session_id)
        if not state or state.get("user_id") != user_id:
            session_id = session_manager.create_session(user_id)
            state = session_manager.get_state(session_id)
    else:
        session_id = session_manager.create_session(user_id)
        state = session_manager.get_state(session_id)

    if not state:
        print(f"❌ Failed to create/get state for user {user_id}")
        await websocket.close()
        return

    print(f"✅ User {user_id} connected with session {session_id}")

    try:
        while True:
            try:
                data = await websocket.receive_text()
                payload = json.loads(data)
                user_msg = payload.get("message", "")
            except WebSocketDisconnect:
                print(f"🔌 User {user_id} disconnected from session {session_id}")
                break
            except Exception as e:
                print(f"❌ WebSocket error for user {user_id}: {e}")
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
                response_data = {
                    "message": last_msg.content,
                    "initiative": initiative.dict() if initiative else None,
                    "session_id": session_id,
                    "user_id": user_id,
                }

                try:
                    await websocket.send_text(json.dumps(response_data))
                    print(f"   ✅ Message sent to user {user_id}")
                except Exception as e:
                    print(f"   ❌ Failed to send message to user {user_id}: {e}")
                    break
    finally:
        session_manager.cleanup_expired_sessions()


app.mount("/", StaticFiles(directory="ui", html=True), name="ui")
