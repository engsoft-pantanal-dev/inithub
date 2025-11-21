from time import sleep
from typing import Optional
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

from .base import BaseElement
from .locators import ChatPageLocators


class ChatElement(BaseElement):
    """Represents the chat interface element."""

    def __init__(self, driver: WebDriver) -> None:
        super().__init__(None, driver)  # type: ignore

    def _sanitize_message(self, message: str) -> str:
        """Remove non-BMP characters (like emojis) that ChromeDriver can't handle."""
        return "".join(char for char in message if ord(char) < 0x10000)

    def send_message(self, message: str) -> None:
        """Send a message in the chat."""
        try:
            if self.check_success_alert():
                print("⚠️ Modal de sucesso detectado. Não é possível enviar mensagem.")
                return

            print(f"\n👤 Usuário: {message}")

            sanitized_message = self._sanitize_message(message)

            input_field = self._wait.until(
                EC.presence_of_element_located(ChatPageLocators.MESSAGE_INPUT)
            )

            if not input_field.is_displayed() or not input_field.is_enabled():
                print(
                    "⚠️ Campo de mensagem não está interagível (pode haver um modal aberto)."
                )
                return

            try:
                input_field.clear()
                input_field.send_keys(sanitized_message)
                input_field.send_keys(Keys.RETURN)
            except Exception as error:
                print("⚠️ Erro ao tentar enviar mensagem.\n", f"Exception: {error}")
                return

            sleep(1)
        except Exception as e:
            print(f"❌ Erro ao enviar mensagem: {e}")
            raise

    def get_last_agent_message(self) -> Optional[str]:
        """Get the last message from the agent."""
        max_retries = 3
        retry_count = 0

        while retry_count < max_retries:
            try:
                agent_containers = self._driver.find_elements(
                    *ChatPageLocators.AGENT_MESSAGE_CONTAINERS
                )

                if not agent_containers:
                    return None

                last_container_index = len(agent_containers) - 1

                agent_containers = self._driver.find_elements(
                    *ChatPageLocators.AGENT_MESSAGE_CONTAINERS
                )
                last_container = agent_containers[last_container_index]

                try:
                    text_div = last_container.find_element(By.CLASS_NAME, "text-sm")
                    last_message = text_div.text.strip()

                    if last_message:
                        print(f"🤖 Agente: {last_message}")
                        return last_message

                    last_message = self._driver.execute_script(
                        "return arguments[0].innerText;", text_div
                    )

                    if last_message and last_message.strip():
                        last_message = last_message.strip()
                        print(f"🤖 Agente: {last_message}")
                        return last_message

                except Exception as inner_e:
                    print(f"⚠️ Tentativa {retry_count + 1} falhou: {inner_e}")
                    retry_count += 1
                    if retry_count < max_retries:
                        sleep(5)
                        continue

                return None

            except Exception as e:
                print(f"⚠️ Erro na tentativa {retry_count + 1}: {e}")
                retry_count += 1
                if retry_count < max_retries:
                    sleep(1)
                    continue
                return None

        print(f"⚠️ Falha após {max_retries} tentativas")
        return None

    def get_all_agent_messages(self) -> list[str]:
        """Get all agent messages from the conversation."""
        try:
            agent_containers = self._driver.find_elements(
                *ChatPageLocators.AGENT_MESSAGE_CONTAINERS
            )

            messages = []
            for container in agent_containers:
                try:
                    paragraphs = container.find_elements(
                        By.XPATH, ".//div[@class='text-sm']/p"
                    )

                    if paragraphs:
                        message_parts = [
                            p.text.strip() for p in paragraphs if p.text.strip()
                        ]
                        message = "\n\n".join(message_parts)
                        if message:
                            messages.append(message)
                    else:
                        text_div = container.find_element(By.CLASS_NAME, "text-sm")
                        message = text_div.text.strip()
                        if message:
                            messages.append(message)
                except Exception:
                    continue

            return messages
        except Exception as e:
            print(f"⚠️ Erro ao obter mensagens: {e}")
            return []

    def wait_for_response(self, timeout: int = 10) -> bool:
        """Wait for the agent to respond."""
        try:
            self._wait.until(
                EC.presence_of_element_located(
                    ChatPageLocators.AGENT_MESSAGE_CONTAINERS
                )
            )
            sleep(1)
            return True
        except Exception:
            return False

    def check_success_alert(self) -> bool:
        """Check if the success alert appeared after publishing."""
        try:
            alert = self._driver.find_element(*ChatPageLocators.SUCCESS_ALERT)
            if alert and alert.is_displayed():
                alert_text = alert.text.strip()
                print(f"\n🎉 Alerta de sucesso detectado: {alert_text}")
                return True
            return False
        except Exception:
            return False
