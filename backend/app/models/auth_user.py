from datetime import datetime
from typing import ClassVar
from uuid import UUID

from sqlalchemy import DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


# read-only view of Supabase's auth.users — only the columns we surface
class AuthUser(Base):
    __tablename__ = "users"
    __table_args__: ClassVar = {"schema": "auth"}

    id: Mapped[UUID] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
