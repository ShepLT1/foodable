from __future__ import annotations

from datetime import date
from typing import Self
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.common import MealType


class RecipeConcept(BaseModel):
    """High-level recipe concept returned by the meal planning AI."""

    model_config = ConfigDict(extra="forbid")

    title: str = Field(min_length=1)
    planning_notes: str | None = None
    cuisine: str | None = None
    key_ingredients: list[str] = Field(min_length=1)


class GeneratedMeal(BaseModel):
    """A single planned meal."""

    model_config = ConfigDict(extra="forbid")

    meal_type: MealType

    existing_recipe_id: UUID | None = None
    recipe_concept: RecipeConcept | None = None

    @model_validator(mode="after")
    def validate_recipe_reference(self) -> Self:
        has_existing = self.existing_recipe_id is not None
        has_concept = self.recipe_concept is not None

        if has_existing == has_concept:
            raise ValueError(
                "Exactly one of existing_recipe_id or recipe_concept must be provided."
            )

        return self


class GeneratedMealPlanDay(BaseModel):
    """Meals planned for a single day."""

    model_config = ConfigDict(extra="forbid")

    date: date
    meals: list[GeneratedMeal] = Field(min_length=1)


class GeneratedMealPlan(BaseModel):
    """Complete meal plan returned by the planning AI."""

    model_config = ConfigDict(extra="forbid")

    title: str = Field(min_length=1)
    days: list[GeneratedMealPlanDay] = Field(min_length=1)


class ExistingRecipe(BaseModel):
    """Existing recipe available for meal plan selection."""

    model_config = ConfigDict(extra="forbid")

    id: UUID

    title: str

    description: str | None = None

    meal_type: MealType | None = None

    cuisine_type: str | None = None

    ingredients: list[str] = Field(min_length=1)


class ExistingMeal(BaseModel):
    """A meal that already exists in the meal plan."""

    model_config = ConfigDict(extra="forbid")

    date: date

    meal_type: MealType

    recipe_id: UUID


class EmptyMealSlot(BaseModel):
    """A meal slot that Claude should fill."""

    model_config = ConfigDict(extra="forbid")

    date: date

    meal_type: MealType


class ExistingMealPlan(BaseModel):
    """Meal plan context supplied to Claude."""

    model_config = ConfigDict(extra="forbid")

    title: str

    existing_meals: list[ExistingMeal] = Field(default_factory=list)

    empty_slots: list[EmptyMealSlot] = Field(default_factory=list)