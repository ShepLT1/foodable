from datetime import date, datetime
from typing import TYPE_CHECKING, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

if TYPE_CHECKING:
    from app.models.meal_plan import MealPlanMeal as DBMealPlanMeal

if TYPE_CHECKING:
    from app.models.meal_plan import MealPlan as DBMealPlan

MealType = Literal[
    "breakfast",
    "lunch",
    "dinner",
    "dessert",
    "snack",
]


class MealPlanMeal(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID

    recipe_id: UUID

    recipe_title: str

    servings: int

    scheduled_date: date | None

    meal_type: MealType | None

    created_at: datetime

    @classmethod
    def from_db_meal(cls, meal: "DBMealPlanMeal") -> "MealPlanMeal":
        return cls(
            id=meal.id,
            recipe_id=meal.recipe_id,
            recipe_title=meal.recipe.title,
            servings=meal.servings,
            scheduled_date=meal.scheduled_date,
            meal_type=meal.meal_type,
            created_at=meal.created_at,
        )


class MealPlanMealCreate(BaseModel):
    recipe_id: UUID

    servings: int = Field(gt=0)

    scheduled_date: date | None = None

    meal_type: MealType | None = None


class MealPlanMealUpdate(BaseModel):
    servings: int | None = Field(default=None, gt=0)

    scheduled_date: date | None = None

    meal_type: MealType | None = None


class MealPlanCreate(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=100,
    )


class MealPlanUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )


class MealPlanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID

    user_id: UUID

    title: str

    meals: list[MealPlanMeal]

    created_at: datetime

    updated_at: datetime

    @classmethod
    def from_db_meal_plan(
        cls,
        meal_plan: "DBMealPlan",
    ) -> "MealPlanResponse":
        return cls(
            id=meal_plan.id,
            user_id=meal_plan.user_id,
            title=meal_plan.title,
            meals=[MealPlanMeal.from_db_meal(meal) for meal in meal_plan.meals],
            created_at=meal_plan.created_at,
            updated_at=meal_plan.updated_at,
        )


class DeleteMealPlanResponse(BaseModel):
    id: UUID
