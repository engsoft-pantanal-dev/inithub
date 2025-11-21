from selenium.webdriver.common.by import By


class LoginPageLocators:
    """Locators for the login page."""

    EMAIL_INPUT = (By.ID, "email")
    PASSWORD_INPUT = (By.ID, "password")
    LOGIN_BUTTON = (By.XPATH, "//button[@type='submit']")


class HomePageLocators:
    """Locators for the home page after login."""

    CHAT_BUTTON = (By.XPATH, "/html/body/div/div/a")
    CHAT_BUTTON_ALT = (By.CSS_SELECTOR, "a[href*='chat']")


class ChatPageLocators:
    """Locators for the chat interface."""

    MESSAGE_INPUT = (By.ID, "message-input")
    SEND_BUTTON = (By.XPATH, "//button[@type='submit']")
    AGENT_MESSAGE_CONTAINERS = (
        By.XPATH,
        "//div[contains(@class, 'flex justify-start')]",
    )
    USER_MESSAGE_CONTAINERS = (By.XPATH, "//div[contains(@class, 'flex justify-end')]")

    TITLE_INPUT = (By.ID, "title")
    THEME_INPUT = (By.ID, "theme")
    DESCRIPTION_INPUT = (By.ID, "description")
    DELIVERABLE_INPUT = (By.ID, "deliverable")
    EVALUATION_CRITERIA_INPUT = (By.ID, "evaluation-criteria")

    PUBLISH_BUTTON = (By.XPATH, "//button[contains(text(), 'Publicar')]")
    CANCEL_BUTTON = (By.XPATH, "//button[contains(text(), 'Cancelar')]")

    SUCCESS_ALERT = (By.XPATH, "//h3[contains(text(), 'Sucesso')]")
