import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    supabase_url: str = os.environ["SUPABASE_URL"]
    database_url: str = os.environ["DATABASE_URL"]
    frontend_url: str = os.environ["FRONTEND_URL"]


settings = Settings()
