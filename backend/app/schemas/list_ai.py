"""
Pydantic schemas for AI-generated grocery lists (structured output).

Defines the shape of a grocery list returned by the Claude API via
strict tool use.

These schemas represent the AI contract only. They intentionally do
not include database fields such as IDs, timestamps, or checked status.
"""

from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class StrictBaseModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class GeneratedGroceryListItem(StrictBaseModel):
    name: str = Field(
        description=(
            "The normalized grocery ingredient name. Merge duplicate "
            "ingredients when appropriate."
        ),
        min_length=1,
        max_length=200,
    )

    quantity: Decimal = Field(
        description=(
            "The merged quantity of the ingredient. Preserve decimal "
            "quantities when necessary."
        ),
        gt=0,
    )

    unit: str | None = Field(
        default=None,
        description=(
            "The normalized unit of measurement. Use null if no unit applies."
        ),
        max_length=50,
    )

    recipes: list[str] = Field(
        description=(
            "The names of all recipes that contributed this ingredient "
            "to the merged grocery list."
        ),
        min_length=1,
    )


class GeneratedGroceryList(StrictBaseModel):
    title: str = Field(
        description="A concise title for the generated grocery list.",
        min_length=1,
        max_length=100,
    )

    items: list[GeneratedGroceryListItem] = Field(
        description="The merged and normalized grocery list.",
        min_length=1,
    )


class GroceryListGenerateRequest(StrictBaseModel):
    recipe_ids: list[UUID] = Field(
        description=(
            "The IDs of two or more recipes to merge into a single grocery list."
        ),
        min_length=2,
    )
