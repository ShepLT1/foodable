"""
Manual check for the Grocery List AI schema against the live Claude API.

(Not part of the automated test suite.) Run this directly when modifying
list_ai.py or prompts_list_gen.py to confirm the schema and prompt still
produce valid structured output.

Makes live API calls (small cost).

Usage:
    python3 -m app.schemas.list_schema_check
"""

import json
import os

from anthropic import Anthropic
from anthropic.types import Message, ToolUseBlock
from dotenv import load_dotenv
from pydantic import ValidationError

from app.schemas.list_ai import GeneratedGroceryList
from app.services.list_ai import LIST_TOOL, SYSTEM_PROMPT

load_dotenv()

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

CLAUDE_MODEL = "claude-haiku-4-5-20251001"
MAX_TOKENS = 2500


TEST_PROMPTS = [
  {
    "name": "Overlapping ingredients",
    "prompt": """
      Generate a merged grocery list from the following recipes.

      Recipe: Chicken Tacos

      Ingredients:
      - 2 lb Chicken Breast
      - 2 Yellow Onions
      - 2 tbsp Olive Oil
      - 8 Tortillas

      Recipe: Beef Chili

      Ingredients:
      - 1 lb Ground Beef
      - 1 Yellow Onion
      - 2 tbsp Olive Oil
      - 2 cans Kidney Beans

      Return the merged grocery list using the provided tool.
    """,
  },
  {
    "name": "No overlapping ingredients",
    "prompt": """
      Generate a merged grocery list from the following recipes.

      Recipe: Pancakes

      Ingredients:
      - 2 cups Flour
      - 2 Eggs
      - 1 cup Milk

      Recipe: Caesar Salad

      Ingredients:
      - 2 Romaine Hearts
      - 4 oz Parmesan Cheese
      - 1 cup Croutons

      Return the merged grocery list using the provided tool.
    """,
  },
  {
    "name": "Do not merge distinct ingredients",
    "prompt": """
      Generate a merged grocery list from the following recipes.

      Recipe: Pasta

      Ingredients:
      - 8 oz Parmesan Cheese
      - 2 tbsp Unsalted Butter

      Recipe: Pizza

      Ingredients:
      - 8 oz Mozzarella Cheese
      - 2 tbsp Salted Butter

      Return the merged grocery list using the provided tool.
    """,
  },
]


def generate_list(prompt: str) -> Message:
    """Call Claude with the grocery list tool."""

    return client.messages.create(
        model=CLAUDE_MODEL,
        system=SYSTEM_PROMPT,
        max_tokens=MAX_TOKENS,
        tools=[LIST_TOOL],  # type: ignore[call-overload]
        tool_choice={
            "type": "tool",
            "name": "generate_grocery_list",
        },
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )


def print_list(grocery_list: GeneratedGroceryList) -> None:
    """Print a validated grocery list."""

    print("Validation passed")
    print(f"Title: {grocery_list.title}")
    print()

    for item in grocery_list.items:
        unit = f" {item.unit}" if item.unit else ""

        print(f"- {item.quantity}{unit} {item.name}")
        print(f"  Recipes: {', '.join(item.recipes)}")


def check_prompt(name: str, prompt: str) -> None:
    """Generate and validate one grocery list."""

    print(f"\n{'=' * 70}")
    print(name)
    print("=" * 70)

    response = generate_list(prompt)

    print(f"stop_reason: {response.stop_reason}")
    print(
        f"tokens: {response.usage.input_tokens} in, {response.usage.output_tokens} out"
    )

    block = response.content[0]

    if not isinstance(block, ToolUseBlock):
        print(f"Unexpected block type: {type(block)}")
        return

    try:
        grocery_list = GeneratedGroceryList.model_validate(block.input)
    except ValidationError as e:
        print(f"VALIDATION FAILED:\n{e}")
        print(json.dumps(block.input, indent=2))
        return

    print_list(grocery_list)


if __name__ == "__main__":
    for test in TEST_PROMPTS:
        check_prompt(test["name"], test["prompt"])
