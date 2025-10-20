from src.config import env

from langchain_openai import ChatOpenAI

import logging
import random


class LLMManager:
    """Gerencia a criação e seleção de LLMs."""

    def get_llm(self):
        """
        Retorna uma nova instância de LLM.
        Seleciona aleatoriamente entre os modelos disponíveis no OpenRouter.
        """
        if env.OPENAI_API_KEY:
            selected_llm = ChatOpenAI(
                model=env.OPENAI_MODEL_NAME,
                temperature=env.AGENT_MODEL_TEMPERATURE,
                api_key=env.OPENAI_API_KEY,
            )
            logging.info(f"(OpenAI) Using as default llm: {selected_llm.model_name}")
            return selected_llm

        elif env.OPENROUTER_API_KEY:
            selected_llm = self.get_open_router_llm()
            logging.info(
                f"(OpenRouter) Using as default llm: {selected_llm.model_name}"
            )
            return selected_llm

        else:
            raise ValueError("No valid API key found for OpenRouter or OpenAI.")

    def get_open_router_llm(self):
        """
        Seleciona aleatoriamente um modelo da lista de modelos OpenRouter.
        """
        models_list = [m.strip() for m in env.OPENROUTER_MODELS_LIST.split(",")]
        selected_model = random.choice(models_list)

        logging.info(f"Selected OpenRouter model: {selected_model}")

        selected_llm = ChatOpenAI(
            base_url=env.OPENROUTER_ENDPOINT,
            model=selected_model,
            temperature=env.AGENT_MODEL_TEMPERATURE,
            api_key=env.OPENROUTER_API_KEY,
        )

        return selected_llm


# Global LLM instance que pode ser atualizado
_current_llm = None
_llm_manager = LLMManager()


def get_global_llm():
    """
    Retorna o LLM global atual.
    Usado pelos nodes quando não há um LLM específico de sessão.
    """
    global _current_llm
    if _current_llm is None:
        _current_llm = _llm_manager.get_llm()
    return _current_llm


def set_session_llm(llm):
    """
    Define o LLM global para a sessão atual.
    """
    global _current_llm
    _current_llm = llm


global_llm = get_global_llm()
