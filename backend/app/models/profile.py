from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, String
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[UUID] = mapped_column(primary_key=True)
    display_name: Mapped[str] = mapped_column(String)

    dietary_restrictions: Mapped[list[str]] = mapped_column(ARRAY(String))
    allergies: Mapped[list[str]] = mapped_column(ARRAY(String))
    preferences: Mapped[list[str]] = mapped_column(ARRAY(String))

    onboarded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
