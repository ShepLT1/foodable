"""
Pydantic schema for AI-generated recipes (structured output).

Defines the shape of a Recipe returned by the Claude API via
strict tool use. Descriptions on individual fields double as
prompt guidance for Claude. (See prompts_recipe_gen.py for
description strings tied to specific behavioral fixes).

Sanity check schema changes against the live API, run:
    python3 -m app.schemas.recipe_schema_check

See PR #31 for details on the testing that led to
these specific field descriptions (fixing ambiguous units,
missing nutrition data, truncated responses, and unrealistic
metric units for US kitchens).
"""

from uuid import UUID

from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

from app.schemas.prompts_recipe_gen import (
    CARBS_DESCRIPTION,
    STEP_DURATION_DESCRIPTION,
    STEP_INGREDIENTS_DESCRIPTION,
    STEP_INSTRUCTION_DESCRIPTION,
    TOOLS_NEEDED_DESCRIPTION,
    UNIT_DESCRIPTION,
)

from app.models.recipe import (
    CUISINE_TYPE_MAX_LENGTH,
    DESCRIPTION_MAX_LENGTH,
    MEAL_TYPE_MAX_LENGTH,
    TITLE_MAX_LENGTH,
)


class StrictBaseModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class RecipeCreate(BaseModel):
    user_id: UUID
    title: str = Field(max_length=TITLE_MAX_LENGTH)
    description: str | None = Field(default=None, max_length=DESCRIPTION_MAX_LENGTH)
    meal_type: str | None = Field(default=None, max_length=MEAL_TYPE_MAX_LENGTH)
    cuisine_type: str | None = Field(default=None, max_length=CUISINE_TYPE_MAX_LENGTH)
    servings: int
    tools_needed: list[str]
    steps: list[dict]
    ingredients_json: list[dict]
    nutrition_json: dict

class RecipeGenerateRequest(BaseModel):
    ingredients: list[str] = Field(min_length=1)
    meal_type: Literal["breakfast", "lunch", "dinner", "dessert", "snack"] | None = None
    cuisine_type: str | None = None

class Ingredient(StrictBaseModel):
    name: str
    quantity: float = Field(description="The quantity of the ingredient.")
    unit: Optional[str] = Field(
        default=None,
        description=UNIT_DESCRIPTION,
    )


class Step(StrictBaseModel):
    instruction: str = Field(description=STEP_INSTRUCTION_DESCRIPTION)
    ingredients: list[str] = Field(description=STEP_INGREDIENTS_DESCRIPTION)
    estimated_duration_minutes: Optional[int] = Field(
        default=None, description=STEP_DURATION_DESCRIPTION
    )


class NutritionInfo(StrictBaseModel):
    calories: float = Field(description="Total calories per serving.")
    protein_g: float = Field(description="Total protein in grams, per serving.")
    carbs_g: float = Field(description=CARBS_DESCRIPTION)
    fat_g: float = Field(description="Total fat in grams, per serving.")
    explanation: str = Field(
        description=(
            "A brief explanation of this recipe's nutritional "
            "benefits and any drawbacks, per serving."
        )
    )


class Recipe(StrictBaseModel):
    title: str = Field(description="The name of the recipe.")
    servings: int = Field(description="The number of servings this recipe makes.")
    description: Optional[str] = Field(
        default=None, description="A brief description of the recipe."
    )
    ingredients: list[Ingredient] = Field(
        description="A list of ingredients required for the recipe."
    )
    tools_needed: list[str] = Field(description=TOOLS_NEEDED_DESCRIPTION)
    steps: list[Step] = Field(
        description="Step-by-step instructions to prepare the recipe."
    )
    nutrition: NutritionInfo = Field(
        description="Nutritional information for the recipe."
    )
    cuisine_type: Optional[str] = Field(
        default=None,
        description="The type of cuisine the recipe belongs to.",
    )
    meal_type: Literal["breakfast", "lunch", "dinner", "dessert", "snack"] = Field(
        description="The type of meal this recipe is intended for."
    )
