from src.services import backend
from src.workflow import decorators
from src.workflow.utils import (
    extract_json_from_llm_response,
    create_json_instruction,
    merge_pydantic_models,
)
from src.schemas.agent import State, FlowClassifier, Initiative
from src.llms import get_global_llm

import logging
import traceback


PROMPTS_DIR = "prompts"


@decorators.log_node
@decorators.with_prompt()
def classify_user_request_v1(state: State, prompt_template=None):
    global_llm = get_global_llm()
    classifier_llm = global_llm.with_structured_output(FlowClassifier)
    try:
        result = classifier_llm.invoke(
            state["messages"]
            + [
                {
                    "role": "system",
                    "content": prompt_template,
                },
            ]
        )
        output = {"flow_type": result.flow_type}
        return output
    except Exception as e:
        logging.error(
            f"Failed to classify flow with structured output: {e}\nTrying manual JSON extraction..."
        )

        try:
            json_instruction = create_json_instruction(use_null=True)
            response = global_llm.invoke(
                state["messages"]
                + [
                    {
                        "role": "system",
                        "content": f"{prompt_template}\n\n{json_instruction}",
                    },
                ]
            )

            extracted = extract_json_from_llm_response(
                response,
                FlowClassifier,
                fallback=FlowClassifier(flow_type="direcionar"),
            )

            if extracted:
                output = {"flow_type": extracted.flow_type}
                logging.info(
                    f"Successfully classified using manual extraction: {extracted.flow_type}"
                )
                return output

        except Exception as fallback_error:
            logging.error(
                f"Fallback also failed: {fallback_error}\nUsing default 'guide' flow type."
            )

        output = {"flow_type": "guide"}
        return output


@decorators.log_node
def route_user_request(state: State):
    flow_type = state.get("flow_type", "direcionar")

    if flow_type == "registrar":
        return {"next": "register_initiative"}
    elif flow_type == "consultar":
        return {"next": "find_initiative"}
    elif flow_type == "publicar":
        return {"next": "publish_initiative"}
    elif flow_type == "feedback":
        return {"next": "collect_feedback"}

    return {"next": "guide"}


@decorators.log_node
@decorators.with_prompt()
@decorators.send_test_case()
def guide_v1(state: State, prompt_template=None, add_comportamentals=True):
    global_llm = get_global_llm()
    result = {
        "messages": global_llm.invoke(
            state["messages"]
            + [
                {
                    "role": "system",
                    "content": prompt_template,
                }
            ],
        ),
        "publish_requested": False,
    }
    return result


@decorators.log_node
@decorators.with_prompt()
@decorators.send_test_case()
def register_initiative_v1(state: State, prompt_template=None):
    global_llm = get_global_llm()
    initiative = state.get("initiative")

    similar_initiatives = (
        backend.find_similar_embeddings(initiative) if initiative else []
    )

    prompt_content = (prompt_template or "").format(
        TITLE=getattr(initiative, "title", "N/A"),
        CONTEXT=getattr(initiative, "context", "N/A"),
        THEME=getattr(initiative, "theme", "N/A"),
        DELIVERABLE=getattr(initiative, "deliverable", "N/A"),
        AVALIATION_CRITERIA=getattr(initiative, "avaliation_criteria", "N/A"),
        SIMILAR_INITIATIVES=similar_initiatives,
    )

    result = {
        "messages": global_llm.invoke(
            state["messages"]
            + [
                {
                    "role": "system",
                    "content": prompt_content,
                }
            ],
        ),
        "similar_initiatives": similar_initiatives,
        "publish_requested": False,
    }
    return result


@decorators.log_node
@decorators.with_prompt()
@decorators.send_test_case()
def collect_feedback_v1(state: State, prompt_template=None):
    global_llm = get_global_llm()
    initiative = state.get("initiative")

    prompt_content = (prompt_template or "").format(
        TITLE=getattr(initiative, "title", "sua iniciativa"),
        THEME=getattr(initiative, "theme", "N/A"),
        CONTEXT=getattr(initiative, "context", "N/A"),
    )

    result = {
        "messages": global_llm.invoke(
            state["messages"]
            + [
                {
                    "role": "system",
                    "content": prompt_content,
                }
            ],
        ),
        "publish_requested": False,
    }

    return result


@decorators.log_node
def publish_initiative_v1(state: State):
    global_llm = get_global_llm()
    initiative = state.get("initiative")
    published_initiatives = state.get("published_initiatives", [])

    if initiative and initiative.title and initiative.title in published_initiatives:
        logging.warning(
            f"Initiative '{initiative.title}' already published in this session, skipping duplicate publication"
        )
        result = {
            "messages": global_llm.invoke(
                [
                    {
                        "role": "system",
                        "content": f"Informe ao usuário de forma amigável que a iniciativa '{initiative.title}' já foi publicada anteriormente nesta sessão e não precisa ser publicada novamente. Pergunte se ele gostaria de criar uma nova iniciativa ou fazer outra coisa.",
                    }
                ]
            ),
            "publish_requested": False,
            "published_initiatives": published_initiatives,
        }
        return result

    if not initiative or not all(
        [
            initiative.title,
            initiative.theme,
            initiative.context,
            initiative.deliverable,
            initiative.avaliation_criteria,
        ]
    ):
        result = {
            "messages": global_llm.invoke(
                [
                    {
                        "role": "system",
                        "content": "Responda ao usuário que a iniciativa não está completa e não pode ser publicada. Peça para ele preencher todos os campos primeiro (título, tema, contexto, entregável e critérios de avaliação).",
                    }
                ]
            ),
            "publish_requested": False,
            "published_initiatives": published_initiatives,
        }
        return result

    logging.info(
        f"User requested to publish initiative '{initiative.title}' - Adding to published list"
    )

    prompt = f"""O usuário confirmou que deseja publicar a iniciativa '{initiative.title}'.

Informe ao usuário de forma positiva que a publicação está sendo processada.

Exemplos:
- "Perfeito! ✅ Estou processando a publicação da sua iniciativa '{initiative.title}'."
- "Ótimo! 🚀 Vou publicar '{initiative.title}' agora mesmo."
- "Entendido! 📤 Publicando sua iniciativa '{initiative.title}'."
"""

    new_published_list = published_initiatives + [initiative.title]

    result = {
        "messages": global_llm.invoke(
            [
                {
                    "role": "system",
                    "content": prompt,
                }
            ]
        ),
        "publish_requested": True,
        "published_initiatives": new_published_list,
    }

    logging.info(
        f"Initiative '{initiative.title}' marked as published. Total published in session: {len(new_published_list)}"
    )
    return result


@decorators.log_node
@decorators.with_prompt()
def extract_initiative_v1(state: State, prompt_template=None, add_comportamentals=True):
    global_llm = get_global_llm()
    new_initiative = state.get("initiative") or Initiative(
        title=None, theme=None, context=None, deliverable=None, avaliation_criteria=None
    )
    try:
        json_instruction = create_json_instruction(use_null=True)
        prompt_content = (
            (prompt_template or "").format(
                TITLE=new_initiative.title,
                CONTEXT=new_initiative.context,
                THEME=new_initiative.theme,
                DELIVERABLE=new_initiative.deliverable,
                AVALIATION_CRITERIA=new_initiative.avaliation_criteria,
            )
            + "\n\n"
            + json_instruction
        )

        response = global_llm.invoke(
            state["messages"]
            + [
                {
                    "role": "system",
                    "content": prompt_content,
                },
            ]
        )

        extracted_initiative = extract_json_from_llm_response(
            response,
            Initiative,
            fallback=None,
        )

        if extracted_initiative:
            updated_initiative = merge_pydantic_models(
                new_initiative, extracted_initiative.model_dump()
            )
            output = {"initiative": updated_initiative}
            return output

        logging.warning(
            "Could not extract initiative from response, keeping previous values"
        )
        output = {"initiative": new_initiative}
        return output

    except Exception as e:
        tb = traceback.format_exc()
        logging.error(
            f"Failed to extract initiative: {e}\nTraceback:\n{tb}\nState: {state}"
        )
        output = {"initiative": new_initiative}
        return output


@decorators.log_node
@decorators.with_prompt()
@decorators.send_test_case()
def find_initiative_v1(state: State, prompt_template=None, add_comportamentals=True):
    global_llm = get_global_llm()
    initiative = state.get("initiative")

    similar_initiatives = (
        backend.find_similar_embeddings(initiative) if initiative else []
    )

    prompt_content = (prompt_template or "").format(
        SIMILAR_INITIATIVES=similar_initiatives
    )

    logging.info(f"PROMP_FIND_INITIATIVE: {prompt_content}")

    result = {
        "messages": global_llm.invoke(
            state["messages"]
            + [
                {
                    "role": "system",
                    "content": prompt_content,
                }
            ],
        ),
        "similar_initiatives": similar_initiatives,
        "publish_requested": False,
    }

    return result
