from datetime import date, datetime
from typing import TYPE_CHECKING, Literal
from uuid import UUID, uuid4

from sqlalchemy import Date, DateTime, ForeignKey, Integer, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.meal_plan import MealPlan
    from app.models.recipe import Recipe

MealType = Literal[
    "breakfast",
    "lunch",
    "dinner",
    "dessert",
    "snack",
]


class MealPlanMeal(Base):
    __tablename__ = "meal_plan_meals"

    id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    meal_plan_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("meal_plans.id", ondelete="CASCADE"),
        nullable=False,
    )

    recipe_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("recipes.id", ondelete="CASCADE"),
        nullable=False,
    )

    servings: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    scheduled_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    meal_type: Mapped[MealType | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    meal_plan: Mapped["MealPlan"] = relationship(
        back_populates="meals",
    )

    recipe: Mapped["Recipe"] = relationship(
        back_populates="meal_plan_meals",
    )
