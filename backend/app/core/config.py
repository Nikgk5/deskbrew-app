"""
DeskBrew Backend — Application Configuration

Centralized settings management using pydantic-settings.
All configuration is loaded from environment variables or a .env file,
ensuring sensitive credentials never enter version control.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ── Database ──────────────────────────────────────────────────────────
    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/deskbrew"

    # ── Supabase ──────────────────────────────────────────────────────────
    supabase_url: str = ""
    supabase_anon_key: str = ""

    # ── CORS ──────────────────────────────────────────────────────────────
    cors_origins: str = "http://localhost:3000"

    # ── API ───────────────────────────────────────────────────────────────
    api_v1_prefix: str = "/api/v1"
    project_name: str = "DeskBrew API"
    debug: bool = False

    @property
    def cors_origin_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]


@lru_cache
def get_settings() -> Settings:
    """Cached settings singleton — avoids re-reading .env on every call."""
    return Settings()
