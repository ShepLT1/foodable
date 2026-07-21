import enum
import uuid
from sqlalchemy import Column, String, Date, ForeignKey, Enum as SQLEnum, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class MealSlot(str, enum.Enum):
    BREAKFAST = "breakfast"
    LUNCH = "lunch"
    DINNER = "dinner"
    SNACK = "snack"


class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("auth.users.id", ondelete="CASCADE"),  # <-- Must include auth. prefix!
        nullable=False,
        index=True,
    )
    recipe_id = Column(
        UUID(as_uuid=True),
        ForeignKey("recipes.id", ondelete="SET NULL"),
        nullable=True,
    )
    custom_name = Column(String(150), nullable=True)
    date = Column(Date, nullable=False, index=True)

    slot = Column(
        SQLEnum(
            MealSlot,
            name="meal_slot_enum",
            values_callable=lambda obj: [e.value for e in obj],  # <-- Perfectly maps lowercase DB values!
        ),
        nullable=False,
    )
    recipe = relationship("Recipe", lazy="selectin")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())