"""
Manual check for the Meal Plan AI schema against the live Claude API.

(Not part of the automated test suite.) Run this directly when modifying
meal_plan_ai.py or prompts_meal_plan_gen.py to confirm the schema and prompt
still produce valid structured output.

Makes live API calls (small cost).

Usage:
    python3 -m app.schemas.meal_plan_schema_check
"""

import json
import os

from anthropic import Anthropic
from anthropic.types import Message, ToolUseBlock
from dotenv import load_dotenv
from pydantic import ValidationError

from app.schemas.meal_plan_ai import GeneratedMealPlan
from app.services.meal_plan_ai import (
    MEAL_PLAN_TOOL,
    SYSTEM_PROMPT,
)

load_dotenv()

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

CLAUDE_MODEL = "claude-haiku-4-5-20251001"
MAX_TOKENS = 2500


TEST_PROMPTS = [
    {
        "name": "Fill empty dinner slots",
        "prompt": """
User Profile

Dietary Restrictions:
- None

Allergies:
- None

Preferences:
- High protein

Planning Window

Start Date: 2026-08-03
Days: 5

Meal Types To Generate:
- dinner

Optimization Goals:
- Lower Cost: No
- Minimize Food Waste: No

Existing Recipes

Recipe ID: 11111111-1111-1111-1111-111111111111
Title: Chicken Stir Fry
Meal Type: dinner
Cuisine: Asian
Ingredients:
- chicken breast
- broccoli
- soy sauce
- rice

Recipe ID: 22222222-2222-2222-2222-222222222222
Title: Spaghetti Bolognese
Meal Type: dinner
Cuisine: Italian
Ingredients:
- ground beef
- pasta
- tomato sauce

Existing Meal Plan

Title:
Weekly Meal Plan

Meal Slots:

2026-08-03 dinner EMPTY

2026-08-04 dinner EMPTY

2026-08-05 dinner EMPTY

2026-08-06 dinner EMPTY

2026-08-07 dinner EMPTY

Return the generate_meal_plan tool output.
""",
    },
    {
        "name": "Reuse existing recipes",
        "prompt": """
User Profile

Dietary Restrictions:
- None

Allergies:
- None

Preferences:
- Family Friendly

Planning Window

Start Date: 2026-08-03
Days: 4

Meal Types To Generate:
- dinner

Optimization Goals:
- Lower Cost: No
- Minimize Food Waste: Yes

Existing Recipes

Recipe ID: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa
Title: Chicken Fajitas
Meal Type: dinner
Cuisine: Mexican
Ingredients:
- chicken
- tortillas
- peppers
- onions

Recipe ID: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb
Title: Chicken Fried Rice
Meal Type: dinner
Cuisine: Asian
Ingredients:
- chicken
- rice
- eggs
- soy sauce

Recipe ID: cccccccc-cccc-cccc-cccc-cccccccccccc
Title: Beef Tacos
Meal Type: dinner
Cuisine: Mexican
Ingredients:
- beef
- tortillas
- lettuce

Existing Meal Plan

Title:
Family Week

Meal Slots:

2026-08-03 dinner EMPTY

2026-08-04 dinner EMPTY

2026-08-05 dinner EMPTY

2026-08-06 dinner EMPTY

Return the generate_meal_plan tool output.
""",
    },
    {
        "name": "Generate new concepts",
        "prompt": """
User Profile

Dietary Restrictions:
- Vegetarian

Allergies:
- Peanuts

Preferences:
- Mediterranean

Planning Window

Start Date: 2026-08-03
Days: 3

Meal Types To Generate:
- dinner

Optimization Goals:
- Lower Cost: No
- Minimize Food Waste: No

Existing Recipes

(none)

Existing Meal Plan

Title:
Vegetarian Week

Meal Slots:

2026-08-03 dinner EMPTY

2026-08-04 dinner EMPTY

2026-08-05 dinner EMPTY

Return the generate_meal_plan tool output.
""",
    },
    {
        "name": "Complete partially-filled meal plan",
        "prompt": """
User Profile

Dietary Restrictions:
- None

Allergies:
- Shellfish

Preferences:
- High protein
- Quick weeknight meals

Planning Window

Start Date: 2026-08-03
Days: 5

Meal Types To Generate:
- dinner

Optimization Goals:
- Lower Cost: No
- Minimize Food Waste: Yes

Existing Recipes

Recipe ID: 11111111-1111-1111-1111-111111111111
Title: Chicken Stir Fry
Meal Type: dinner
Cuisine: Asian
Ingredients:
- chicken breast
- broccoli
- soy sauce
- rice

Recipe ID: 22222222-2222-2222-2222-222222222222
Title: Turkey Chili
Meal Type: dinner
Cuisine: American
Ingredients:
- ground turkey
- kidney beans
- onion
- tomato

Recipe ID: 33333333-3333-3333-3333-333333333333
Title: Beef Tacos
Meal Type: dinner
Cuisine: Mexican
Ingredients:
- ground beef
- tortillas
- lettuce
- cheddar cheese

Recipe ID: 44444444-4444-4444-4444-444444444444
Title: Chicken Fried Rice
Meal Type: dinner
Cuisine: Asian
Ingredients:
- chicken breast
- rice
- eggs
- soy sauce

Existing Meal Plan

Title:
Weekly Dinner Plan

Meal Slots:

2026-08-03 dinner
Recipe ID: 11111111-1111-1111-1111-111111111111

2026-08-04 dinner
EMPTY

2026-08-05 dinner
Recipe ID: 22222222-2222-2222-2222-222222222222

2026-08-06 dinner
EMPTY

2026-08-07 dinner
EMPTY

Return the generate_meal_plan tool output.
""",
    },
]


def generate_meal_plan(prompt: str) -> Message:
    """Call Claude with the meal planning tool."""

    return client.messages.create(
        model=CLAUDE_MODEL,
        system=SYSTEM_PROMPT,
        max_tokens=MAX_TOKENS,
        tools=[MEAL_PLAN_TOOL],  # type: ignore[call-overload]
        tool_choice={
            "type": "tool",
            "name": "generate_meal_plan",
        },
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )


def print_plan(plan: GeneratedMealPlan) -> None:
    """Pretty-print a validated meal plan."""

    print("Validation passed")
    print(f"Title: {plan.title}")
    print()

    for day in plan.days:
        print(day.date)

        for meal in day.meals:
            print(f"  {meal.meal_type}")

            if meal.existing_recipe_id:
                print(f"    Existing Recipe: {meal.existing_recipe_id}")
            else:
                concept = meal.recipe_concept
                assert concept is not None

                print(f"    Concept: {concept.title}")

                if concept.cuisine:
                    print(f"    Cuisine: {concept.cuisine}")

                print("    Ingredients: " + ", ".join(concept.key_ingredients))

        print()


def check_prompt(name: str, prompt: str) -> None:
    """Generate and validate one meal plan."""

    print(f"\n{'=' * 70}")
    print(name)
    print("=" * 70)

    response = generate_meal_plan(prompt)

    print(f"stop_reason: {response.stop_reason}")
    print(
        f"tokens: {response.usage.input_tokens} in, {response.usage.output_tokens} out"
    )

    block = response.content[0]

    if not isinstance(block, ToolUseBlock):
        print(f"Unexpected block type: {type(block)}")
        return

    try:
        plan = GeneratedMealPlan.model_validate(block.input)
    except ValidationError as e:
        print(f"\nVALIDATION FAILED\n")
        print(e)
        print()
        print(json.dumps(block.input, indent=2))
        return

    print_plan(plan)


if __name__ == "__main__":
    for test in TEST_PROMPTS:
        check_prompt(
            test["name"],
            test["prompt"],
        )
