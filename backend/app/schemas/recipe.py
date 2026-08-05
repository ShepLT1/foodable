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

from datetime import datetime
from typing import TYPE_CHECKING, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.models.common import MealType
from app.models.recipe import (
    CUISINE_TYPE_MAX_LENGTH,
    DESCRIPTION_MAX_LENGTH,
    MEAL_TYPE_MAX_LENGTH,
    TITLE_MAX_LENGTH,
)
from app.schemas.prompts_recipe_gen import (
    CARBS_DESCRIPTION,
    SAFE_SUBSTITUTE_DESCRIPTION,
    STEP_DURATION_DESCRIPTION,
    STEP_INGREDIENTS_DESCRIPTION,
    STEP_INSTRUCTION_DESCRIPTION,
    TOOLS_NEEDED_DESCRIPTION,
    UNIT_DESCRIPTION,
)


class StrictBaseModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class RecipeCreate(StrictBaseModel):
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


class RecipeUpdate(StrictBaseModel):
    is_public: bool | None = None


class RecipeGenerateRequest(StrictBaseModel):
    title: str | None = None
    description: str | None = None
    ingredients: list[str] = Field(min_length=1)
    meal_type: MealType | None = None
    cuisine_type: str | None = None


class Ingredient(StrictBaseModel):
    name: str
    quantity: float = Field(description="The quantity of the ingredient.")
    unit: str | None = Field(
        default=None,
        description=UNIT_DESCRIPTION,
    )


class Step(StrictBaseModel):
    instruction: str = Field(description=STEP_INSTRUCTION_DESCRIPTION)
    ingredients: list[str] = Field(description=STEP_INGREDIENTS_DESCRIPTION)
    estimated_duration_minutes: int | None = Field(
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
    description: str | None = Field(
        default=None, description="A brief description of the recipe."
    )
    ingredients: list[Ingredient] = Field(
        min_length=1,
        description="A list of ingredients required for the recipe.",
    )
    tools_needed: list[str] = Field(description=TOOLS_NEEDED_DESCRIPTION)
    steps: list[Step] = Field(
        min_length=1,
        description="Step-by-step instructions to prepare the recipe.",
    )
    nutrition: NutritionInfo = Field(
        description="Nutritional information for the recipe."
    )
    cuisine_type: str | None = Field(
        default=None,
        description="The type of cuisine the recipe belongs to.",
    )
    meal_type: MealType = Field(
        description="The type of meal this recipe is intended for."
    )
    safe_substitute: bool = Field(
        default=False,
        description=SAFE_SUBSTITUTE_DESCRIPTION,
    )


class RecipeCreator(StrictBaseModel):
    id: UUID
    display_name: str | None


class RecipeResponse(StrictBaseModel):
    id: UUID
    title: str
    description: str | None
    meal_type: str | None
    cuisine_type: str | None
    servings: int
    tools_needed: list[str]
    steps: list[Step]
    ingredients: list[Ingredient]
    nutrition: NutritionInfo
    is_public: bool
    is_favorited: bool = False
    safe_substitute: bool = False
    creator: RecipeCreator | None = None
    created_at: datetime

    if TYPE_CHECKING:
        from app.models.recipe import Recipe as DBRecipe
        from app.repositories.recipe import RecipeRow

    @classmethod
    def from_db_recipe(
        cls,
        recipe: "DBRecipe",
        creator: "RecipeCreator | None" = None,
        is_favorited: bool = False,
        safe_substitute: bool = False,
    ) -> "RecipeResponse":
        return cls(
            id=recipe.id,
            title=recipe.title,
            description=recipe.description,
            meal_type=recipe.meal_type,
            cuisine_type=recipe.cuisine_type,
            servings=recipe.servings,
            tools_needed=recipe.tools_needed,
            steps=[Step.model_validate(s) for s in recipe.steps_json],
            ingredients=[Ingredient.model_validate(i) for i in recipe.ingredients_json],
            nutrition=NutritionInfo.model_validate(recipe.nutrition_json),
            is_public=recipe.is_public,
            is_favorited=is_favorited,
            safe_substitute=safe_substitute,
            creator=creator,
            created_at=recipe.created_at,
        )

    @classmethod
    def from_row(cls, row: "RecipeRow") -> "RecipeResponse":
        """Map a row from the shared recipe read query into a response."""
        return cls.from_db_recipe(
            row.recipe,
            RecipeCreator(id=row.creator.id, display_name=row.creator.display_name),
            is_favorited=row.is_favorited,
        )


class RecipeSearchParams(StrictBaseModel):
    q: str | None = None
    cuisine_type: str | None = None
    meal_type: MealType | None = None
    exclude_own: bool = False
    following_only: bool = False
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)
    sort_by: Literal["title", "created_at"] = "created_at"
    order: Literal["asc", "desc"] = "desc"


class PaginatedRecipes(StrictBaseModel):
    items: list[RecipeResponse]
    total: int
    page: int
    limit: int
