from src.services import backend
from src.workflow import decorators
from src.schemas.agent import State, FlowClassifier, Initiative
from src.llms import default_llm

import logging
import traceback


PROMPTS_DIR = "prompts"


@decorators.log_node
@decorators.with_prompt()
def classify_user_request_v1(state: State, prompt_template=None):
    classifier_llm = default_llm.with_structured_output(FlowClassifier)
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
            f"Failed to classify flow: {e}\n\nUsing default 'guide' flow type."
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
    result = {
        "messages": default_llm.invoke(
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
        "messages": default_llm.invoke(
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
    new_initiative = state.get("initiative") or Initiative(
        title=None, theme=None, context=None, deliverable=None, avaliation_criteria=None
    )
    classifier_llm = default_llm.with_structured_output(Initiative)
    try:
        prompt_content = (prompt_template or "").format(
            TITLE=new_initiative.title,
            CONTEXT=new_initiative.context,
            THEME=new_initiative.theme,
            DELIVERABLE=new_initiative.deliverable,
            AVALIATION_CRITERIA=new_initiative.avaliation_criteria,
        )
        result = classifier_llm.invoke(
            state["messages"]
            + [
                {
                    "role": "system",
                    "content": prompt_content,
                },
            ]
        )
        logging.debug(f"Extracted initiative: {result}")
        updated_initiative = Initiative(
            title=getattr(result, "title") or new_initiative.title,
            context=getattr(result, "context") or new_initiative.context,
            theme=getattr(result, "theme") or new_initiative.theme,
            deliverable=getattr(result, "deliverable") or new_initiative.deliverable,
            avaliation_criteria=getattr(result, "avaliation_criteria")
            or new_initiative.avaliation_criteria,
        )
        output = {"initiative": updated_initiative}
        return output
    except Exception as e:
        tb = traceback.format_exc()
        logging.error(
            f"Failed to classify initiative: {e}\nTraceback:\n{tb}\nState: {state}\nPrompt: {prompt_content if 'prompt_content' in locals() else 'N/A'}"
        )
        output = {"initiative": new_initiative}
        return output


@decorators.log_node
@decorators.with_prompt()
@decorators.send_test_case()
def find_initiative_v1(state: State, prompt_template=None, add_comportamentals=True):
    initiative = state.get("initiative")

    similar_initiatives = (
        backend.find_similar_embeddings(initiative) if initiative else []
    )

    prompt_content = (prompt_template or "").format(
        SIMILAR_INITIATIVES=similar_initiatives
    )

    logging.info(f"PROMP_FIND_INITIATIVE: {prompt_content}")

    result = {
        "messages": default_llm.invoke(
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
