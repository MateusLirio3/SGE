from pydantic_settings import BaseSettings, SettingsConfigDict
from fastapi_csrf_protect import CsrfProtect

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    secret_key: str
    cookie_key: str = "fastapi-csrf-token"
    header_name: str = "X-CSRF-Token"
    cookie_secure: bool = False
    httponly: bool = False
    cookie_samesite: str = "lax"

settings = Settings()

@CsrfProtect.load_config
def get_csrf_config():
    return settings
