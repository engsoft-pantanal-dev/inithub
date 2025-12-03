from pathlib import Path


class LLM:
    """LLM client for generating natural responses during initiative registration."""

    def __init__(self, initiative_data: dict):
        """Initialize LLM with initiative data."""
        self.initiative_data = initiative_data
        self.conversation_history = []
        self.client = None
        self.prompt_template = self._load_prompt_template()

    def _load_prompt_template(self) -> str:
        """Load prompt template from file."""
        try:
            prompt_path = Path(__file__).parent / "prompts" / "user_simulation_v1.md"
            if prompt_path.exists():
                return prompt_path.read_text(encoding="utf-8")
            else:
                print("⚠️ Prompt template não encontrado, usando template padrão")
                return self._get_default_template()
        except Exception as e:
            print(f"⚠️ Erro ao carregar prompt template: {e}")
            return self._get_default_template()

    def _get_default_template(self) -> str:
        """Get default prompt template."""
        return """
Você está simulando um usuário que quer registrar a seguinte iniciativa:

TÍTULO: {title}
TEMA: {theme}
CONTEXTO: {context}
DESCRIÇÃO: {description}
ENTREGÁVEL: {deliverable}
CRITÉRIOS DE AVALIAÇÃO: {evaluation_criteria}

Histórico da conversa:
{conversation_history}

O agente perguntou: "{agent_question}"

Responda de forma natural e conversacional, como um usuário real faria, fornecendo as informações da iniciativa de acordo com o que foi perguntado. Seja conciso mas informativo. Não repita informações já fornecidas anteriormente.
"""

    def setup_client(self):
        """Setup the LLM client with environment variables."""
        try:
            from automation.config import (
                OPENROUTER_API_KEY,
                OPENROUTER_ENDPOINT,
                OPENROUTER_MODEL_NAME,
                AGENT_MODEL_TEMPERATURE,
            )
            from langchain_openai import ChatOpenAI

            if not OPENROUTER_API_KEY:
                print("⚠️ OPENROUTER_API_KEY não configurada")
                self.client = None
                return

            self.client = ChatOpenAI(
                base_url=OPENROUTER_ENDPOINT,
                model=OPENROUTER_MODEL_NAME,
                temperature=AGENT_MODEL_TEMPERATURE,
                api_key=OPENROUTER_API_KEY,  # type: ignore
            )
            print("✅ LLM client configurado com sucesso!")
        except Exception as e:
            print(f"⚠️ Erro ao configurar LLM: {e}")
            print("📝 Usando modo fallback (respostas pré-definidas)")
            self.client = None

    def get_response(self, agent_question: str) -> str:
        """
        Generate a natural response based on the agent's question and initiative data.
        Falls back to predefined responses if LLM is not available.
        """
        self.conversation_history.append({"role": "agent", "content": agent_question})

        if self.client:
            response = self._get_llm_response(agent_question)
        else:
            response = self._get_fallback_response(agent_question)

        self.conversation_history.append({"role": "user", "content": response})
        return response

    def _get_llm_response(self, agent_question: str) -> str:
        """Get response from LLM."""
        try:
            prompt = self._build_prompt(agent_question)
            response = self.client.invoke([{"role": "user", "content": prompt}])  # type: ignore
            return str(response.content).strip()  # type: ignore
        except Exception as e:
            print(f"⚠️ Erro ao obter resposta da LLM: {e}")
            return self._get_fallback_response(agent_question)

    def _build_prompt(self, agent_question: str) -> str:
        """Build the prompt for the LLM."""
        return self.prompt_template.format(
            title=self.initiative_data.get("title", ""),
            theme=self.initiative_data.get("theme", ""),
            context=self.initiative_data.get("context", ""),
            description=self.initiative_data.get("description", ""),
            deliverable=self.initiative_data.get("deliverable", ""),
            evaluation_criteria=self.initiative_data.get("evaluation_criteria", ""),
            conversation_history=self._format_conversation_history(),
            agent_question=agent_question,
        )

    def _format_conversation_history(self) -> str:
        """Format conversation history for the prompt."""
        if not self.conversation_history:
            return "Nenhuma conversa anterior."

        formatted = []
        for entry in self.conversation_history[-6:]:  # Last 3 exchanges
            role = "Agente" if entry["role"] == "agent" else "Usuário"
            formatted.append(f"{role}: {entry['content']}")
        return "\n".join(formatted)

    def _get_fallback_response(self, agent_question: str) -> str:
        """Get fallback response when LLM is not available."""
        question_lower = agent_question.lower()

        if any(
            word in question_lower
            for word in ["contexto", "problema", "oportunidade", "motivou"]
        ):
            return self.initiative_data.get("context", "")

        elif any(
            word in question_lower
            for word in ["descrição", "como funciona", "como seria", "detalhe"]
        ):
            return self.initiative_data.get("description", "")

        elif any(word in question_lower for word in ["título", "nome", "chamar"]):
            return self.initiative_data.get("title", "")

        elif any(word in question_lower for word in ["tema", "área", "categoria"]):
            return self.initiative_data.get("theme", "")

        elif any(
            word in question_lower
            for word in [
                "entregável",
                "resultado",
                "produto final",
                "o que será entregue",
            ]
        ):
            return self.initiative_data.get("deliverable", "")

        elif any(
            word in question_lower
            for word in ["avaliação", "critério", "medir", "sucesso"]
        ):
            return self.initiative_data.get("evaluation_criteria", "")

        elif any(
            word in question_lower
            for word in ["iniciar", "começar", "registrar", "cadastrar"]
        ):
            return "Sim, gostaria de registrar uma nova iniciativa!"

        elif any(
            word in question_lower
            for word in ["confirmar", "correto", "está certo", "verificar"]
        ):
            return "Sim, está tudo correto! Pode prosseguir."

        elif any(
            word in question_lower
            for word in ["mais alguma", "adicionar", "complementar"]
        ):
            return "Não, acho que é isso. Muito obrigado pela ajuda!"

        else:
            return "Sim, exatamente!"
