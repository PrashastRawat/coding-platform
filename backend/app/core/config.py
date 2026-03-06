from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""  # ✅ add this line

    class Config:
        env_file = ".env"
settings = Settings()

GROQ_API_KEY: str = ""