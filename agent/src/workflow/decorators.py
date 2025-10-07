from src.config import env
from src.schemas.agent import State
from src.schemas.sheets import TestCaseRow
from src.services.google_sheets import get_test_cases_sheet, add_test_case

from functools import wraps
import logging
from logging import getLogger
from datetime import datetime
import json


PROMPTS_DIR = "prompts"


def log_node(func):
    log = getLogger("log_node")

    @wraps(func)
    def wrapper(state: State, *args, **kwargs):
        def short_state(s):
            short = dict(s)
            if "messages" in short and isinstance(short["messages"], list):
                msgs = (
                    short["messages"][-2:]
                    if len(short["messages"]) > 2
                    else short["messages"]
                )

                def msg_repr(m):
                    if hasattr(m, "role") and hasattr(m, "content"):
                        return {
                            "role": getattr(m, "role", None),
                            "content": getattr(m, "content", None),
                        }
                    if isinstance(m, dict):
                        return {"role": m.get("role"), "content": m.get("content")}
                    return str(m)

                short["messages"] = [msg_repr(m) for m in msgs]
            short["initiative"] = getattr(
                s.get("initiative"), "__dict__", s.get("initiative")
            )
            short["flow_type"] = getattr(
                s.get("flow_type"), "__dict__", s.get("flow_type")
            )

            return short

        log.debug(f"[{func.__name__}] State before: {short_state(state)}")
        result = func(state, *args, **kwargs)
        log.debug(
            f"[{func.__name__}] State after: {short_state(result) if isinstance(result, dict) else result}"
        )
        return result

    return wrapper


def with_prompt(name: str | None = None, add_comportamentals: bool = False):
    def decorator(func):
        @wraps(func)
        def wrapper(state: State, *args, **kwargs):
            prompt_template = ""
            comportamentals_file = "comportamentals_v1.0.0.md"
            try:
                with open(
                    f"{PROMPTS_DIR}/{name if name else func.__name__}.md",
                    "r",
                    encoding="utf-8",
                ) as f:
                    prompt_template = f.read()
            except FileNotFoundError:
                logging.error(
                    f"Prompt template '{name}' não encontrado em {PROMPTS_DIR}."
                )
            if add_comportamentals:
                try:
                    with open(
                        f"{PROMPTS_DIR}/{comportamentals_file}",
                        "r",
                        encoding="utf-8",
                    ) as f:
                        prompt_template += f.read()
                except FileNotFoundError:
                    logging.error(
                        f"Arquivo '{comportamentals_file}' não encontrado em {PROMPTS_DIR}."
                    )
            kwargs["prompt_template"] = prompt_template
            logging.debug(f"Template carregado: {name} (len={len(prompt_template)})")
            return func(state, *args, **kwargs)

        return wrapper

    return decorator


def send_test_case():
    def decorator(func):
        @wraps(func)
        def wrapper(state: State, *args, **kwargs):
            if not env.ENABLE_GOOGLE_SHEETS:
                return func(state, *args, **kwargs)

            user_response = "unknown-user-response"
            messages = state.get("messages", [])
            for msg in reversed(messages):
                content = getattr(msg, "content", None) or (
                    msg.get("content") if isinstance(msg, dict) else ""
                )
                if content:
                    user_response = content
                    break

            result = func(state, *args, **kwargs)

            agent_response = ""
            model_name = "unknown-model"
            response_metadata = ""
            if isinstance(result, dict) and "messages" in result:
                result_messages = result["messages"]
                if hasattr(result_messages, "content"):
                    agent_response = result_messages.content
                    model_name = _get_model_name_from_ai_message(result_messages)
                    response_metadata = _get_response_metadata_from_ai_message(
                        result_messages
                    )
                elif isinstance(result_messages, list) and result_messages:
                    last_msg = result_messages[-1]
                    agent_response = getattr(last_msg, "content", "") or (
                        last_msg.get("content") if isinstance(last_msg, dict) else ""
                    )
                    model_name = _get_model_name_from_ai_message(last_msg)
                    response_metadata = _get_response_metadata_from_ai_message(last_msg)

            if user_response and agent_response:
                try:
                    similar_initiatives = []
                    if isinstance(result, dict):
                        similar_initiatives = result.get("similar_initiatives", [])
                    if not similar_initiatives:
                        similar_initiatives = state.get("similar_initiatives", [])

                    sheet = get_test_cases_sheet()
                    test_case = {
                        "model": model_name,
                        "user_id": state.get("user_id"),
                        "session_id": state.get("session_id"),
                        "prompt_id": func.__name__,
                        "created_at": datetime.now().isoformat(),
                        "user_response": user_response,
                        "agent_response": agent_response,
                        "response_metadata": response_metadata,
                        "retrieved_contexts": similar_initiatives,
                    }

                    add_test_case(sheet, TestCaseRow(**test_case))
                except Exception as e:
                    logging.error(f"Erro ao registrar test case: {e}")

            return result

        return wrapper

    return decorator


def _get_response_metadata_from_ai_message(ai_message):
    response_metadata = None
    if hasattr(ai_message, "response_metadata"):
        response_metadata = ai_message.response_metadata
    elif isinstance(ai_message, dict):
        response_metadata = ai_message.get("response_metadata", {})

    if response_metadata:
        try:
            return json.dumps(response_metadata, indent=None, separators=(",", ":"))
        except (TypeError, ValueError):
            return str(response_metadata)

    return ""


def _get_model_name_from_ai_message(ai_message):
    if hasattr(ai_message, "response_metadata"):
        response_metadata = ai_message.response_metadata
        if isinstance(response_metadata, dict):
            return response_metadata.get("model_name", "unknown-model")
        elif hasattr(response_metadata, "get"):
            return response_metadata.get("model_name", "unknown-model")

    if isinstance(ai_message, dict):
        return ai_message.get("response_metadata", {}).get(
            "model_name", "unknown-model"
        )

    return "unknown-model"
