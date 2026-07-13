"""
Manual check for the Recipe schema against the live
Claude API.

(Not part of the automated test suite) Run this
directly when modifying recipe.py or prompts_recipe_gen.py
to confirm the schema still produces valid structured output.

Makes live API calls (small cost, ~$0.01 total for all
prompts below).

Usage: python3 -m app.schemas.recipe_schema_check
"""

import json
import os

from anthropic import Anthropic
from anthropic.types import Message, ToolUseBlock
from dotenv import load_dotenv
from pydantic import ValidationError

from app.schemas.recipe import Recipe

load_dotenv()

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Haiku model - Lightweight, fast + cheap for right now to test schema changes
CLAUDE_MODEL = "claude-haiku-4-5-20251001"
MAX_TOKENS = 2500

RECIPE_TOOL = {
    "name": "create_recipe",
    "description": "Create a structured recipe",
    "strict": True,
    "input_schema": Recipe.model_json_schema(),
}

TEST_PROMPTS = [
    "Give me a recipe with a spice blend that uses small "
    "amounts of many different spices.",
    "Give me a recipe that uses vanilla extract and baking soda in small quantities.",
    "Give me a recipe with fresh herbs like thyme, rosemary, "
    "and basil in small amounts.",
    "Give me a recipe using a pinch of salt and a small amount of cinnamon.",
    "Give me a complex breakfast recipe with at least 10 ingredients.",
]


def generate_recipe(prompt: str) -> Message:
    """Call Claude with the recipe tool for a single prompt."""
    return client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=MAX_TOKENS,
        # RECIPE_TOOL is a plain dict; mypy can't match it against the
        # SDK's typed tool overloads, but it's a valid tool definition
        # at runtime.
        tools=[RECIPE_TOOL],  # type: ignore[call-overload]
        tool_choice={"type": "tool", "name": "create_recipe"},
        messages=[{"role": "user", "content": prompt}],
    )


def print_recipe(recipe: Recipe) -> None:
    """Print a validated Recipe in a readable format."""
    print("Validation passed")
    print(f"Title: {recipe.title}")
    print(f"Meal type: {recipe.meal_type}")
    print(
        f"Nutrition: cal={recipe.nutrition.calories}, "
        f"protein={recipe.nutrition.protein_g}g, "
        f"carbs={recipe.nutrition.carbs_g}g, "
        f"fat={recipe.nutrition.fat_g}g"
    )
    print("Ingredients:")
    for ing in recipe.ingredients:
        unit = f" {ing.unit}" if ing.unit else ""
        print(f"  - {ing.quantity}{unit} {ing.name}")
    print(f"Tools needed: {', '.join(recipe.tools_needed)}")
    print("Steps:")
    for i, step in enumerate(recipe.steps, 1):
        duration = (
            f" ({step.estimated_duration_minutes} min)"
            if step.estimated_duration_minutes
            else ""
        )
        print(f"  {i}. {step.instruction}{duration}")
        if step.ingredients:
            print(f"     Ingredients: {', '.join(step.ingredients)}")


def check_prompt(prompt: str) -> None:
    """Generate and validate a recipe for one prompt, printing the result."""
    print(f"\n{'=' * 60}")
    print(f"PROMPT: {prompt}")
    print("=" * 60)

    response = generate_recipe(prompt)
    print(f"stop_reason: {response.stop_reason}")
    print(
        f"tokens: {response.usage.input_tokens} in, {response.usage.output_tokens} out"
    )

    block = response.content[0]
    if not isinstance(block, ToolUseBlock):
        print(f"Unexpected block type: {type(block)}")
        return

    raw_input = block.input

    try:
        recipe = Recipe.model_validate(raw_input)
    except ValidationError as e:
        print(f"VALIDATION FAILED: {e}")
        print(json.dumps(raw_input, indent=2))
        return

    print_recipe(recipe)


if __name__ == "__main__":
    for prompt in TEST_PROMPTS:
        check_prompt(prompt)
