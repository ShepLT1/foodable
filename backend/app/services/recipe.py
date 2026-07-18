import os

from anthropic import Anthropic
from anthropic.types import ToolUseBlock
from pydantic import ValidationError

from app.schemas.recipe import Recipe

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
        raise ValueError(f"Unexpected block type: {type(block)}")
    try:
        return Recipe.model_validate(block.input)
    except ValidationError as e:
        raise RecipeGenerationError(
            f"Claude's response failed schema validation: {e}"
        ) from e
