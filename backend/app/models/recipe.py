from uuid import UUID, uuid4
from datetime import datetime

from sqlalchemy import ForeignKey, String, Boolean, DateTime, func, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB

from app.db.base import Base

TITLE_MAX_LENGTH = 200
DESCRIPTION_MAX_LENGTH = 1000
MEAL_TYPE_MAX_LENGTH = 50
CUISINE_TYPE_MAX_LENGTH = 100


class Recipe(Base):
    __tablename__ = "recipes"
    __table_args__ = (
        CheckConstraint(
            "meal_type IN ('breakfast', 'lunch', 'dinner', 'dessert', 'snack')",
            name="recipes_meal_type_check",
        ),
    )

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("auth.users.id", ondelete="CASCADE"),
        nullable=False,
    )

    title: Mapped[str] = mapped_column(String(TITLE_MAX_LENGTH), nullable=False)

    description: Mapped[str | None] = mapped_column(
        String(DESCRIPTION_MAX_LENGTH), nullable=True
    )

    meal_type: Mapped[str | None] = mapped_column(
        String(MEAL_TYPE_MAX_LENGTH), nullable=True
    )

    cuisine_type: Mapped[str | None] = mapped_column(
        String(CUISINE_TYPE_MAX_LENGTH), nullable=True
    )

    steps: Mapped[list] = mapped_column("steps_json", JSONB, nullable=False)

    ingredients: Mapped[list[dict]] = mapped_column(
        "ingredients_json", JSONB, nullable=False
    )

    nutrition: Mapped[dict] = mapped_column("nutrition_json", JSONB, nullable=False)

    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
