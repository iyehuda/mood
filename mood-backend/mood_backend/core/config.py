from typing import Annotated, Any, Literal, List

from pydantic import (
    AnyUrl,
    BeforeValidator,
)
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        # Use top level .env file (one level above ./mood-backend/)
        env_file="../.env",
        env_ignore_empty=True,
        extra="ignore",
    )

    # General configuration
    ENVIRONMENT: Literal["local", "production"] = "local"

    # FastAPI configuration
    FRONTEND_HOST: str = "http://localhost:5173"
    ROOT_PATH: str = ""
    BACKEND_CORS_ORIGINS: Annotated[
        list[AnyUrl] | str, BeforeValidator(parse_cors)
    ] = []

    @property
    def all_cors_origins(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS] + [
            self.FRONTEND_HOST
        ]

    # Recommendation service configuration
    GOOGLE_API_KEY: str
    RECOMMENDATION_MODEL_NAME: str = "gemini-2.0-flash"
    RECOMMENDATION_MODEL_TEMPERATURE: float = 0.7

    # Playlist scheduler settings
    PLAYLIST_SCHEDULE_HOUR: int = 0  # Default to midnight
    PLAYLIST_SCHEDULE_MINUTE: int = 0


settings = Settings()  # type: ignore
