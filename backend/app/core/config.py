import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    supabase_url: str = os.environ.get("SUPABASE_URL", "http://127.0.0.1:54321")
    supabase_publishable_key: str = os.environ["SUPABASE_PUBLISHABLE_KEY"]
    database_url: str = os.environ["DATABASE_URL"]
    frontend_url: str = os.environ.get("FRONTEND_URL", "http://localhost:5173")


settings = Settings()
