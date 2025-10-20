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
        )
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
    }
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
    }

    return result
