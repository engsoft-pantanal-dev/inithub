import re
import json
import logging
from typing import Any, Dict, Optional, Type, TypeVar
from pydantic import BaseModel


T = TypeVar("T", bound=BaseModel)


def extract_json_from_llm_response(
    response: Any, schema: Type[T], fallback: Optional[T] = None
) -> Optional[T]:
    """
    Extrai e valida JSON de uma resposta de LLM, convertendo para o schema Pydantic especificado.

    Compatível com modelos que retornam JSON embutido em texto (como Claude).

    Args:
        response: Resposta do LLM (pode ser objeto AIMessage, dict ou string)
        schema: Classe Pydantic para validação e tipagem
        fallback: Valor padrão a retornar em caso de erro (opcional)

    Returns:
        Instância do schema com dados parseados, ou fallback se houver erro

    Example:
        >>> response = llm.invoke(messages)
        >>> initiative = extract_json_from_llm_response(response, Initiative, fallback=Initiative())
    """
    try:
        content = None
        if hasattr(response, "content"):
            content = response.content
        elif isinstance(response, dict):
            content = response.get("content", response)
        else:
            content = str(response)

        match = re.search(r"\{[\s\S]*\}", str(content))
        if not match:
            logging.warning(f"No JSON found in LLM response: {content[:200]}...")
            return fallback

        parsed_json = json.loads(match.group())

        result = schema(**parsed_json)
        logging.debug(f"Successfully parsed JSON into {schema.__name__}: {result}")
        return result

    except json.JSONDecodeError as e:
        content_str = str(content)[:500] if content else "None"
        logging.error(
            f"Failed to decode JSON from LLM response: {e}\nContent: {content_str}"
        )
        return fallback
    except Exception as e:
        content_str = str(content)[:500] if content else "None"
        logging.error(
            f"Failed to extract JSON from LLM response: {e}\nContent: {content_str}"
        )
        return fallback


def create_json_instruction(use_null: bool = True) -> str:
    """
    Cria instrução para o LLM responder com JSON válido.

    Args:
        use_null: Se True, instrui usar null em vez de None

    Returns:
        String com a instrução formatada
    """
    instruction = "Responda APENAS com um objeto JSON válido."
    if use_null:
        instruction += " Use null em vez de None para valores ausentes."
    return instruction


def merge_pydantic_models(base: T, updates: Dict[str, Any]) -> T:
    """
    Merge de um modelo Pydantic base com atualizações parciais.

    Mantém valores existentes quando o update é None ou ausente.

    Args:
        base: Instância do modelo Pydantic base
        updates: Dicionário com valores a atualizar

    Returns:
        Nova instância do modelo com valores merged

    Example:
        >>> base_initiative = Initiative(title="Old", context=None)
        >>> updates = {"context": "New context", "title": None}
        >>> merged = merge_pydantic_models(base_initiative, updates)
        >>> merged.title  # "Old" (mantido porque update é None)
        >>> merged.context  # "New context" (atualizado)
    """
    model_class = type(base)
    base_dict = base.model_dump()

    merged_data = {
        key: updates.get(key) if updates.get(key) is not None else base_dict.get(key)
        for key in base_dict.keys()
    }

    return model_class(**merged_data)
