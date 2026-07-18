import os

from anthropic import Anthropic
from anthropic.types import ToolUseBlock
from pydantic import ValidationError

from app.schemas.recipe import Recipe, RecipeGenerateRequest
from app.models.profile import Profile

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

CLAUDE_MODEL = "claude-haiku-4-5-20251001"
MAX_TOKENS = 2500

RECIPE_TOOL = {
    "name": "create_recipe",
    "description": "Create a structured recipe",
    "strict": True,
    "input_schema": Recipe.model_json_schema(),
}


class RecipeGenerationError(Exception):
    """Raised when Claude's recipe gen output is invalid, or unusable."""


def _validate_recipe_response(raw_input: dict) -> Recipe:
    """Validate Claude's tool-use input against the Recipe schema."""
    try:
        return Recipe.model_validate(raw_input)
    except ValidationError as e:
        raise RecipeGenerationError(
            f"Claude's response failed schema validation: {e}"
        ) from e


async def generate_recipe(prompt: str) -> Recipe:
    """
    Generate a recipe using the Claude API and validate it against the
    Recipe schema.

    Args:
        prompt (str): The prompt to send to the Claude API.

    Returns:
        Recipe: The validated recipe object.
    """
    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=MAX_TOKENS,
        tools=[RECIPE_TOOL],  # type: ignore[call-overload]
        tool_choice={"type": "tool", "name": "create_recipe"},
        messages=[{"role": "user", "content": prompt}],
    )

    block = response.content[0]
    if not isinstance(block, ToolUseBlock):
        raise RecipeGenerationError(f"Unexpected block type: {type(block)}")

    return _validate_recipe_response(block.input)


def _build_prompt(request: RecipeGenerateRequest, profile: Profile) -> str:
    """Build the base Claude prompt from the user's generation request."""
    parts = [f"Create a recipe using: {', '.join(request.ingredients)}."]

    if request.meal_type:
        parts.append(f"This should be a {request.meal_type} recipe.")

    if request.cuisine_type:
        parts.append(f"Cuisine style: {request.cuisine_type}.")

    if profile.allergies:
        parts.append(
            f"IMPORTANT: this person has the following allergies and the "
            f"recipe must not include any of these ingredients under any "
            f"circumstances: {', '.join(profile.allergies)}."
        )

    if profile.dietary_restrictions:
        parts.append(
            f"Dietary restrictions to respect: "
            f"{', '.join(profile.dietary_restrictions)}."
        )

    if profile.preferences:
        parts.append(
            f"Additional preferences to consider: {', '.join(profile.preferences)}."
        )

    return " ".join(parts)
