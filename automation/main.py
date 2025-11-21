from time import sleep

from automation.config import (
    INITHUB_URL,
    HEADLESS_MODE,
    DEFAULT_EMAIL,
    DEFAULT_PASSWORD,
    MAX_INTERACTIONS,
    DEFAULT_TIMEOUT,
    MESSAGE_DELAY,
    RESPONSE_WAIT_TIME,
)
from automation.pages import ChatPage
from automation.user_session import UserSession
from automation.llm import LLM
from automation.initiatives import get_initiative


def simulate_initiative_registration():
    """Simulate a user registering an initiative using LLM."""
    print("🚀 Iniciando simulação de cadastro de iniciativa\n")

    initiative = get_initiative(2)
    print(f"📋 Iniciativa a ser cadastrada: {initiative['title']}\n")

    llm = LLM(initiative_data=initiative)
    llm.setup_client()
    print()

    with UserSession(site_url=INITHUB_URL, headless=HEADLESS_MODE) as session:
        home_page = session.login(email=DEFAULT_EMAIL, password=DEFAULT_PASSWORD)

        home_page.open_chat()
        chat_page = ChatPage(session.driver)

        initial_message = (
            "Olá! Tenho uma nova ideia de iniciativa que gostaria de registrar."
        )

        chat_page.send_message(initial_message)

        interaction_count = 0

        while interaction_count < MAX_INTERACTIONS:
            interaction_count += 1
            print(f"\n--- Interação {interaction_count} ---")

            if chat_page.check_success_alert():
                print(
                    "\n✅ Iniciativa já está publicada (alerta visível). Encerrando simulação."
                )
                break

            if not chat_page.wait_for_response(timeout=DEFAULT_TIMEOUT):
                print("⏱️ Timeout esperando resposta do agente")
                break

            sleep(RESPONSE_WAIT_TIME)

            agent_message = chat_page.get_last_agent_message()

            if not agent_message:
                print("⚠️ Não foi possível obter mensagem do agente")
                break

            response = llm.get_response(agent_message)

            sleep(MESSAGE_DELAY)

            chat_page.send_message(response)
            sleep(MESSAGE_DELAY)

        if interaction_count >= MAX_INTERACTIONS:
            print("\n⚠️ Número máximo de interações atingido")

        print("\n✅ Simulação concluída! Pressione Enter para sair...")
        input()


def main():
    """Main entry point for the automation."""
    try:
        simulate_initiative_registration()
    except KeyboardInterrupt:
        print("\n\n🛑 Interrompido pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro durante execução: {e}")
        raise


if __name__ == "__main__":
    main()
