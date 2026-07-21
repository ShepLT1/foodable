from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.recipe import RecipeResponse


class MealPlanCreate(BaseModel):
    date: date
    slot: str
    recipe_id: Optional[UUID] = None
    custom_name: Optional[str] = None


class MealPlanUpdate(BaseModel):
    date: Optional[date] = None
    slot: Optional[str] = None
    recipe_id: Optional[UUID] = None
    custom_name: Optional[str] = None


class MealPlanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    date: date
    slot: str
    recipe_id: Optional[UUID] = None
    custom_name: Optional[str] = None
    recipe: Optional[RecipeResponse] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
