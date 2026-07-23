import os

from anthropic import AsyncAnthropic
from anthropic.types import ToolUseBlock
from pydantic import ValidationError

from app.schemas.list_ai import GeneratedGroceryList
from app.schemas.prompts_list_gen import MERGE_RULES
from app.models.recipe import Recipe

client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

CLAUDE_MODEL = "claude-haiku-4-5-20251001"
MAX_TOKENS = 2500

SYSTEM_PROMPT = f"""
You are an expert culinary assistant responsible for generating merged grocery
lists from multiple recipes.

Responsibilities:

- Merge duplicate ingredients.
- Normalize ingredient names.
- Normalize compatible units.
- Sum compatible quantities.
- Generate a concise grocery list title.

Rules:

- Never invent ingredients.
- Never remove ingredients.
- Never substitute ingredients.
- Never change serving sizes.
- Never estimate prices.
- Never categorize ingredients.
- Preserve distinct ingredients when they are meaningfully different.
- Preserve decimal quantities.
- Return only structured tool output.

{MERGE_RULES}
""".strip()

LIST_TOOL = {
    "name": "generate_grocery_list",
    "description": "Generate a structured merged grocery list.",
    "strict": True,
    "input_schema": GeneratedGroceryList.model_json_schema(),
}


class GroceryListGenerationError(Exception):
    """Raised when Claude's grocery list output is invalid or unusable."""


def _validate_list_response(raw_input: dict) -> GeneratedGroceryList:
    """Validate Claude's tool-use input against the GeneratedGroceryList schema."""
    try:
        return GeneratedGroceryList.model_validate(raw_input)
    except ValidationError as e:
        raise GroceryListGenerationError(
            f"Claude's response failed schema validation: {e}"
        ) from e


def _validate_generated_list(
    grocery_list: GeneratedGroceryList,
    recipes: list[Recipe],
) -> None:
    """
    Perform sanity checks that go beyond schema validation.
    """

    recipe_titles = {recipe.title for recipe in recipes}
    seen_items: set[tuple[str, str | None]] = set()

    for item in grocery_list.items:
        key = (item.name.casefold(), item.unit)

        if key in seen_items:
            raise GroceryListGenerationError(
                f"Duplicate grocery item returned: {item.name}"
            )

        seen_items.add(key)

        for recipe_name in item.recipes:
            if recipe_name not in recipe_titles:
                raise GroceryListGenerationError(
                    f"Unknown recipe referenced: {recipe_name}"
                )


def _build_prompt_from_recipes(recipes: list[Recipe]) -> str:
    """
    Build the Claude prompt from a collection of recipes.
    """

    parts = [
        "Generate a merged grocery list from the following recipes.",
        "",
    ]

    for recipe in recipes:
        parts.append(f"Recipe: {recipe.title}")
        parts.append("Ingredients:")

        for ingredient in recipe.ingredients_json:
            quantity = ingredient["quantity"]
            unit = ingredient.get("unit")
            name = ingredient["name"]

            if unit:
                parts.append(f"- {quantity} {unit} {name}")
            else:
                parts.append(f"- {quantity} {name}")

        parts.append("")

    parts.append("Return the merged grocery list using the provided tool.")

    return "\n".join(parts)


async def generate_grocery_list(
    recipes: list[Recipe],
) -> GeneratedGroceryList:
    """
    Generate a merged grocery list using Claude and validate the result.
    """

    prompt = _build_prompt_from_recipes(recipes)

    response = await client.messages.create(
        model=CLAUDE_MODEL,
        system=SYSTEM_PROMPT,
        max_tokens=MAX_TOKENS,
        tools=[LIST_TOOL],
        tool_choice={
            "type": "tool",
            "name": "create_grocery_list",
        },
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    block = response.content[0]

    if not isinstance(block, ToolUseBlock):
        raise GroceryListGenerationError(f"Unexpected block type: {type(block)}")

    grocery_list = _validate_list_response(block.input)

    _validate_generated_list(grocery_list, recipes)

    return grocery_list
