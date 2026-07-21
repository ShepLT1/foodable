from datetime import date, datetime
from typing import Any
from uuid import UUID
from pydantic import BaseModel, ConfigDict


# 1. Flexible Recipe Schema: grabs whatever data exists in DB without crashing on missing columns!
class MealPlanRecipeSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="ignore")

    id: UUID | str | None = None
    title: str | None = None
    name: str | None = None
    description: str | None = None
    servings: Any = None
    tools_needed: Any = None
    steps: Any = None
    ingredients: Any = None
    nutrition: Any = None
    nutrition_info: Any = None  # Catches alternate schema naming!


# 2. Updated Meal Plan Response Schema
class MealPlanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    recipe_id: UUID | None = None
    custom_name: str | None = None
    date: date
    slot: Any  # Accepts enum or string representation safely
    created_at: datetime | None = None
    updated_at: datetime | None = None

    # Replace strict RecipeResponse with our bulletproof summary schema
    recipe: MealPlanRecipeSummary | None = None