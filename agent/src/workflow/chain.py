from src.workflow import nodes
from src.schemas.agent import State

from langgraph.graph import StateGraph, START, END


workflow = StateGraph(State)

workflow.add_node("classify_user_request", nodes.classify_user_request_v1)
workflow.add_node("guide", nodes.guide_v1)
workflow.add_node("find_initiative", nodes.find_initiative_v1)
workflow.add_node("register_initiative", nodes.register_initiative_v1)
workflow.add_node("extract_initiative", nodes.extract_initiative_v1)

workflow.add_node("route_user_request", nodes.route_user_request)

workflow.add_edge(START, "classify_user_request")
workflow.add_edge("classify_user_request", "extract_initiative")
workflow.add_edge("extract_initiative", "route_user_request")
workflow.add_conditional_edges(
    "route_user_request",
    lambda state: state.get("next"),
    {
        "guide": "guide",
        "find_initiative": "find_initiative",
        "register_initiative": "register_initiative",
    },
)
workflow.add_edge("guide", END)
workflow.add_edge("find_initiative", END)
workflow.add_edge("register_initiative", END)

chain = workflow.compile()

chain.get_graph().draw_png("Fluxo do Agente.png")
