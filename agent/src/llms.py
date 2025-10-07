from src.config import env

from langchain_openai import ChatOpenAI

import logging
import random


def get_open_router_llm():
    models_list = [m.strip() for m in env.OPENROUTER_MODELS_LIST.split(",")]
    selected_model = random.choice(models_list)

    selected_llm = ChatOpenAI(
        base_url=env.OPENROUTER_ENDPOINT,
        model=selected_model,
        temperature=env.AGENT_MODEL_TEMPERATURE,
        api_key=env.OPENROUTER_API_KEY,
    )

    return selected_llm


if env.OPENAI_API_KEY:
    default_llm = ChatOpenAI(
        model=env.OPENAI_MODEL_NAME,
        temperature=env.AGENT_MODEL_TEMPERATURE,
        api_key=env.OPENAI_API_KEY,
    )
    logging.info(f"(OpenAI) Using as default llm: {default_llm.model_name}")

elif env.OPENROUTER_API_KEY:
    default_llm = get_open_router_llm()
    logging.info(f"(OpenRouter) Using as default llm: {default_llm.model_name}")

else:
    raise ValueError("No valid API key found for OpenRouter or OpenAI.")
