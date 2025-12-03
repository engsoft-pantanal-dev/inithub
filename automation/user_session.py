from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

from .pages import LoginPage, HomePage, ChatPage


class UserSession:
    """Manages a user session in the InitHub application."""

    def __init__(self, site_url: str, headless: bool = False):
        self.site_url = site_url
        self.driver = self._setup_driver(headless)

    def __enter__(self):
        """Context manager entry."""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit - ensures browser is closed."""
        self.quit()

    def _setup_driver(self, headless: bool) -> webdriver.Chrome:
        """Setup and return a Chrome WebDriver."""
        try:
            options = ChromeOptions()

            if headless:
                options.add_argument("--headless")

            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-gpu")

            service = ChromeService(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=options)
            driver.maximize_window()

            print("✅ Chrome WebDriver inicializado com sucesso!")
            return driver

        except Exception as e:
            print(f"❌ Erro ao inicializar Chrome: {e}")
            raise

    def login(self, email: str, password: str) -> HomePage:
        """Login and return the home page."""
        login_page = LoginPage(self.driver, self.site_url)
        login_page.login(email, password)
        return HomePage(self.driver)

    def quit(self):
        """Close the browser."""
        if self.driver:
            print("\n🛑 Fechando navegador...")
            self.driver.quit()
