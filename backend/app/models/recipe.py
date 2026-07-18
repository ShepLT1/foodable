from uuid import UUID, uuid4
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, String

from app.db.base import Base

TITLE_MAX_LENGTH = 200
DESCRIPTION_MAX_LENGTH = 1000
MEAL_TYPE_MAX_LENGTH = 50
CUISINE_TYPE_MAX_LENGTH = 100


class Recipe(Base):
    __tablename__ = "recipes"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="CASCADE"),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        String(DESCRIPTION_MAX_LENGTH), nullable=True
    )

    meal_type: Mapped[str | None] = mapped_column(
        String(MEAL_TYPE_MAX_LENGTH), nullable=True
    )

    cuisine_type: Mapped[str | None] = mapped_column(
        String(CUISINE_TYPE_MAX_LENGTH), nullable=True
    )
