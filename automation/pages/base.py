from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.wait import WebDriverWait

MAX_WAIT_SECONDS = 10.0


class BasePage:
    """Base class for all page objects."""

    def __init__(self, driver: WebDriver) -> None:
        self._driver = driver
        self._driver.implicitly_wait(5)
        self._wait = WebDriverWait(driver, MAX_WAIT_SECONDS)


class BaseElement:
    """Base class for all page elements/components."""

    def __init__(self, parent: WebElement, driver: WebDriver) -> None:
        self._parent = parent
        self._driver = driver
        self._wait = WebDriverWait(driver, MAX_WAIT_SECONDS)
