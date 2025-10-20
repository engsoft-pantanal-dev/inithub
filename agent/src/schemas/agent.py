from langgraph.graph.message import add_messages
from pydantic import BaseModel, Field
from typing import Literal, TypedDict, Annotated


class FlowClassifier(BaseModel):
    flow_type: Literal["direcionar", "consultar", "registrar"] = Field(
        ...,
        description="Fluxo de conversa que o usuário deseja seguir, buscando direcionamento, consultando uma iniciativa existente ou registrando uma nova.",
    )


class Initiative(BaseModel):
    title: str | None = Field(None, description="Título da iniciativa.")
    context: str | None = Field(None, description="Contexto detalhado da iniciativa.")
    theme: str | None = Field(None, description="Tema da iniciativa.")
    deliverable: str | None = Field(None, description="Entregável da iniciativa.")
    avaliation_criteria: str | None = Field(
        None, description="Critérios de avaliação da iniciativa."
    )

    def __str__(self):
        parts = []
        if self.title:
            parts.append(f"title: {self.title}")
        if self.theme:
            parts.append(f"theme: {self.theme}")
        if self.context:
            parts.append(f"context: {self.context}")
        if self.deliverable:
            parts.append(f"deliverable: {self.deliverable}")
        if self.avaliation_criteria:
            parts.append(f"avaliation_criteria: {self.avaliation_criteria}")
        return " ".join(parts)


class State(TypedDict):
    messages: Annotated[list, add_messages]
    initiative: Initiative | None
    similar_initiatives: list | None
    flow_type: str | None
    user_id: str | None
    session_id: str | None
