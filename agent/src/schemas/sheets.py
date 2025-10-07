from typing import TypedDict


class TestCaseRow(TypedDict):
    model: str
    user_id: str
    session_id: str
    prompt_id: str
    created_at: str
    user_response: str
    agent_response: str
    response_metadata: str
    retrieved_contexts: list[str] | None
