from src.schemas.agent import State

from typing import Dict, Optional, Any
import uuid
import time
import logging


class SessionManager:
    def __init__(self, session_timeout: int = 3600):
        self._sessions: Dict[str, Dict[str, Any]] = {}
        self._session_timeout = session_timeout
        self.logger = logging.getLogger(__name__)

    def create_session(self, user_id: str) -> str:
        session_id = str(uuid.uuid4())

        initial_state: State = {
            "messages": [],
            "flow_type": None,
            "initiative": None,
            "user_id": user_id,
            "session_id": session_id,
        }

        self._sessions[session_id] = {
            "user_id": user_id,
            "state": initial_state,
            "created_at": time.time(),
            "last_activity": time.time(),
        }

        self.logger.info(f"Created new session {session_id} for user {user_id}")
        return session_id

    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        session = self._sessions.get(session_id)
        if session:
            session["last_activity"] = time.time()
        return session

    def get_state(self, session_id: str) -> Optional[State]:
        session = self.get_session(session_id)
        return session["state"] if session else None

    def update_state(self, session_id: str, new_state: State) -> bool:
        session = self.get_session(session_id)

        if session:
            new_state["user_id"] = session["user_id"]
            new_state["session_id"] = session_id
            session["state"] = new_state
            session["last_activity"] = time.time()
            return True
        return False

    def get_user_sessions(self, user_id: str) -> list[str]:
        return [
            session_id
            for session_id, session_data in self._sessions.items()
            if session_data["user_id"] == user_id
        ]

    def delete_session(self, session_id: str) -> bool:
        if session_id in self._sessions:
            user_id = self._sessions[session_id]["user_id"]
            del self._sessions[session_id]
            self.logger.info(f"Deleted session {session_id} for user {user_id}")
            return True
        return False

    def cleanup_expired_sessions(self) -> int:
        current_time = time.time()
        expired_sessions = [
            session_id
            for session_id, session_data in self._sessions.items()
            if current_time - session_data["last_activity"] > self._session_timeout
        ]

        for session_id in expired_sessions:
            self.delete_session(session_id)

        if expired_sessions:
            self.logger.info(f"Cleaned up {len(expired_sessions)} expired sessions")

        return len(expired_sessions)

    def get_session_count(self) -> int:
        return len(self._sessions)

    def get_user_count(self) -> int:
        return len(
            set(session_data["user_id"] for session_data in self._sessions.values())
        )


session_manager = SessionManager()
