from time import sleep
from typing import Optional
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException

from .base import BasePage
from .locators import LoginPageLocators, HomePageLocators, ChatPageLocators
from .elements import ChatElement


class LoginPage(BasePage):
    """Model the login page of InitHub."""

    def __init__(self, driver: WebDriver, url: str) -> None:
        super().__init__(driver)
        self.url = url
        self._driver.get(url)

    def login(self, email: str, password: str) -> None:
        """Perform login with provided credentials."""
        try:
            print(f"\n🔑 Fazendo login como {email}...")

            email_input = self._wait.until(
                EC.presence_of_element_located(LoginPageLocators.EMAIL_INPUT)
            )
            password_input = self._driver.find_element(
                *LoginPageLocators.PASSWORD_INPUT
            )
            login_button = self._driver.find_element(*LoginPageLocators.LOGIN_BUTTON)

            email_input.clear()
            email_input.send_keys(email)

            password_input.clear()
            password_input.send_keys(password)

            print("✅ Credenciais preenchidas, fazendo login...")
            login_button.click()

            sleep(2)
            print(f"✅ Login realizado! URL atual: {self._driver.current_url}")

        except Exception as e:
            print(f"❌ Erro no login: {e}")
            raise


class HomePage(BasePage):
    """Model the home page after login."""

    def __init__(self, driver: WebDriver) -> None:
        super().__init__(driver)

    def open_chat(self) -> None:
        """Open the chat interface."""
        try:
            print("\n💬 Abrindo chat do agente...")

            try:
                chat_button = self._wait.until(
                    EC.element_to_be_clickable(HomePageLocators.CHAT_BUTTON)
                )
            except:
                chat_button = self._wait.until(
                    EC.element_to_be_clickable(HomePageLocators.CHAT_BUTTON_ALT)
                )

            chat_button.click()
            sleep(1)
            print("✅ Chat aberto!")

        except Exception as e:
            print(f"❌ Erro ao abrir chat: {e}")
            raise


class ChatPage(BasePage):
    """Model the chat page for interacting with the agent."""

    def __init__(self, driver: WebDriver) -> None:
        super().__init__(driver)
        self.chat_element = ChatElement(driver)

    def send_message(self, message: str) -> None:
        """Send a message to the agent."""
        self.chat_element.send_message(message)

    def get_last_agent_message(self) -> Optional[str]:
        """Get the last message from the agent."""
        return self.chat_element.get_last_agent_message()

    def get_all_agent_messages(self) -> list[str]:
        """Get all agent messages."""
        return self.chat_element.get_all_agent_messages()

    def wait_for_response(self, timeout: int = 10) -> bool:
        """Wait for agent response."""
        return self.chat_element.wait_for_response(timeout)

    def check_success_alert(self) -> bool:
        """Check if the success alert appeared after publishing."""
        return self.chat_element.check_success_alert()
