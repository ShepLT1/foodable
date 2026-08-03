import os
from datetime import date, timedelta

from anthropic import AsyncAnthropic
from anthropic.types import ToolChoiceToolParam, ToolParam, ToolUseBlock
from pydantic import ValidationError

from app.models.common import MealType
from app.models.profile import Profile
from app.schemas.meal_plan import MealPlanGenerateRequest, MealPlanOptimizations
from app.schemas.meal_plan_ai import (
    ExistingMealPlan,
    ExistingRecipe,
    GeneratedMealPlan,
)
from app.schemas.prompts_meal_plan_gen import (
    MEAL_PLAN_SYSTEM_PROMPT,
    PLANNING_RULES,
)

client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

CLAUDE_MODEL = "claude-haiku-4-5-20251001"
MAX_TOKENS = 3500

SYSTEM_PROMPT = f"""
{MEAL_PLAN_SYSTEM_PROMPT}

{PLANNING_RULES}
""".strip()

MEAL_PLAN_TOOL: ToolParam = {
    "name": "generate_meal_plan",
    "description": (
        "Generate or complete a structured meal plan using existing recipes "
        "and recipe concepts when necessary."
    ),
    "strict": True,
    "input_schema": GeneratedMealPlan.model_json_schema(),
}

TOOL_CHOICE: ToolChoiceToolParam = {
    "type": "tool",
    "name": "generate_meal_plan",
}


class MealPlanGenerationError(Exception):
    """Raised when Claude returns an invalid meal plan."""


def _validate_meal_plan_response(
    raw_input: dict,
) -> GeneratedMealPlan:
    """
    Validate Claude's tool-use response against the GeneratedMealPlan schema.
    """

    try:
        return GeneratedMealPlan.model_validate(raw_input)
    except ValidationError as e:
        raise MealPlanGenerationError(
            f"Claude's response failed schema validation: {e}"
        ) from e


def _validate_generated_meal_plan(
    generated_plan: GeneratedMealPlan,
    recipes: list[ExistingRecipe],
    existing_plan: ExistingMealPlan,
    request: MealPlanGenerateRequest,
) -> None:
    """
    Perform deterministic validation beyond Pydantic schema validation.
    """

    recipe_ids = {recipe.id for recipe in recipes}

    expected_slots = {
        (
            slot.date,
            slot.meal_type,
        )
        for slot in existing_plan.empty_slots
    }

    end_date = request.start_date + timedelta(days=request.days - 1)

    seen_days: set[date] = set()
    returned_slots: set[tuple[date, MealType]] = set()

    for day in generated_plan.days:
        if day.date in seen_days:
            raise MealPlanGenerationError(f"Duplicate day returned: {day.date}")

        seen_days.add(day.date)

        if day.date < request.start_date or day.date > end_date:
            raise MealPlanGenerationError(
                f"Generated date outside requested range: {day.date}"
            )

        seen_meal_types: set[MealType] = set()

        for meal in day.meals:
            if meal.meal_type in seen_meal_types:
                raise MealPlanGenerationError(
                    f"Duplicate meal type on {day.date}: {meal.meal_type}"
                )

            seen_meal_types.add(meal.meal_type)

            slot_key = (
                day.date,
                meal.meal_type,
            )

            if slot_key not in expected_slots:
                raise MealPlanGenerationError(
                    f"Claude generated an unexpected meal for "
                    f"{day.date} ({meal.meal_type})."
                )

            returned_slots.add(slot_key)

            if (
                meal.existing_recipe_id is not None
                and meal.existing_recipe_id not in recipe_ids
            ):
                raise MealPlanGenerationError(
                    f"Claude referenced an unknown recipe: {meal.existing_recipe_id}"
                )

    missing_slots = set(expected_slots) - returned_slots

    if missing_slots:
        missing_str = ", ".join(
            f"{slot_date} ({meal_type})"
            for slot_date, meal_type in sorted(missing_slots)
        )

        raise MealPlanGenerationError(
            f"Claude did not generate meals for every requested slot. "
            f"Missing: {missing_str}"
        )


def _build_optimization_section(
    optimizations: MealPlanOptimizations,
) -> list[str]:
    """
    Build optimization instructions for Claude.
    """

    if not optimizations.lower_cost and not optimizations.minimize_food_waste:
        return []

    parts = [
        "Optimization Rules",
        "",
        (
            "Your primary objective is to satisfy these optimization goals "
            "while still respecting the user's dietary preferences and "
            "meal requests."
        ),
        "",
        "Recipe Selection",
        ("Choose whichever option best satisfies the requested optimization goals:"),
        "- Reuse an existing recipe from the available recipe catalog.",
        "- Create a new recipe concept.",
        (
            "Existing recipes are optional. Do not favor reusing an existing "
            "recipe if creating a new recipe concept would better satisfy the "
            "requested optimization goals."
        ),
        "",
    ]

    if optimizations.lower_cost:
        parts.extend(
            [
                "Lower Cost",
                "- Prefer inexpensive proteins such as chicken, turkey, eggs, beans, and lentils.",
                "- Reuse pantry staples like rice, pasta, oats, and potatoes.",
                "- Avoid expensive ingredients unless they provide significant value.",
                "- Reducing grocery cost is more important than maximizing meal variety.",
                "",
            ]
        )

    if optimizations.minimize_food_waste:
        parts.extend(
            [
                "Minimize Food Waste",
                "- Reuse ingredients across multiple meals whenever practical.",
                "- Minimize one-off ingredients.",
                "- Reuse proteins, vegetables, grains, sauces, and herbs.",
                "- Ingredient reuse should be considered one of the highest priorities.",
                "- It is acceptable for several meals to share many ingredients.",
                "",
            ]
        )

    parts.extend(
        [
            "These optimization goals should influence every meal you generate.",
            (
                "When these optimization goals conflict with maximizing meal "
                "variety, prioritize the optimization goals."
            ),
            (
                "Do not increase meal variety if doing so would conflict with "
                "the requested optimization goals."
            ),
        ]
    )

    return parts


def _build_prompt_from_meal_plan(
    profile: Profile,
    recipes: list[ExistingRecipe],
    meal_plan: ExistingMealPlan,
    request: MealPlanGenerateRequest,
) -> str:
    """
    Build the Claude prompt for meal plan generation.
    """

    recipe_lookup = {recipe.id: recipe for recipe in recipes}

    parts: list[str] = []

    parts.append("User Profile")
    parts.append("")

    if profile.dietary_restrictions:
        parts.append("Dietary Restrictions: " + ", ".join(profile.dietary_restrictions))

    if profile.allergies:
        parts.append("Allergies: " + ", ".join(profile.allergies))

    if profile.preferences:
        parts.append("Preferences: " + ", ".join(profile.preferences))

    if (
        not profile.dietary_restrictions
        and not profile.allergies
        and not profile.preferences
    ):
        parts.append("No dietary preferences provided.")

    parts.append("")
    parts.append("Planning Request")
    parts.append("")

    parts.append(f"Start Date: {request.start_date.isoformat()}")
    parts.append(f"Duration: {request.days} day(s)")

    parts.append("Generate Meal Types: " + ", ".join(request.meal_types))

    parts.append("")
    parts.append("Existing Meals (read-only)")
    parts.append("")

    existing_meals = sorted(
        meal_plan.existing_meals,
        key=lambda meal: (
            meal.date,
            meal.meal_type,
        ),
    )

    current_date = None

    for meal in existing_meals:
        if meal.meal_type not in request.meal_types:
            continue

        if meal.date != current_date:
            current_date = meal.date
            parts.append(current_date.isoformat())

        recipe = recipe_lookup.get(meal.recipe_id)

        if recipe is None:
            raise MealPlanGenerationError(
                f"Meal plan references unknown recipe {meal.recipe_id}"
            )

        parts.append(f"{meal.meal_type.title()}: {recipe.title}")

    parts.append("")
    parts.append("The above meals already exist and MUST NOT be modified or returned.")

    parts.append("")
    parts.append("Meal Slots To Generate")
    parts.append("")

    empty_slots = sorted(
        meal_plan.empty_slots,
        key=lambda slot: (
            slot.date,
            slot.meal_type,
        ),
    )

    current_date = None

    for slot in empty_slots:
        if slot.date != current_date:
            current_date = slot.date
            parts.append(current_date.isoformat())

        parts.append(slot.meal_type.title())

    parts.append("")
    parts.append("Generate exactly one meal for each meal slot listed above.")

    parts.append("Recipe Selection Strategy")
    parts.append("")

    parts.append("You may satisfy each requested meal by either:")
    parts.append("- Referencing an existing recipe from the recipe catalog.")
    parts.append("- Creating a new recipe concept.")
    parts.append("")

    parts.append("Available Recipe Catalog")
    parts.append("")

    for recipe in recipes:
        parts.append(f"Recipe ID: {recipe.id}")
        parts.append(f"Title: {recipe.title}")

        if recipe.meal_type:
            parts.append(f"Meal Type: {recipe.meal_type}")

        if recipe.cuisine_type:
            parts.append(f"Cuisine: {recipe.cuisine_type}")

        if recipe.description:
            parts.append(f"Description: {recipe.description}")

        parts.append("Ingredients:")

        for ingredient in recipe.ingredients:
            parts.append(f"- {ingredient}")

        parts.append("")

    parts.extend(
        _build_optimization_section(
            request.optimizations,
        )
    )
    parts.append("")

    parts.append("Return the completed meal plan using the provided tool.")

    return "\n".join(parts)


async def generate_meal_plan(
    profile: Profile,
    recipes: list[ExistingRecipe],
    meal_plan: ExistingMealPlan,
    request: MealPlanGenerateRequest,
) -> GeneratedMealPlan:
    """
    Generate or complete a meal plan using Claude.

    Existing recipes are reused whenever appropriate. When no suitable recipe
    exists, Claude returns a RecipeConcept describing the desired meal.
    """

    prompt = _build_prompt_from_meal_plan(
        profile=profile,
        recipes=recipes,
        meal_plan=meal_plan,
        request=request,
    )

    response = await client.messages.create(
        model=CLAUDE_MODEL,
        system=SYSTEM_PROMPT,
        max_tokens=MAX_TOKENS,
        tools=[MEAL_PLAN_TOOL],
        tool_choice=TOOL_CHOICE,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    block = response.content[0]

    if not isinstance(block, ToolUseBlock):
        raise MealPlanGenerationError(f"Unexpected response block type: {type(block)}")

    generated_plan = _validate_meal_plan_response(block.input)

    _validate_generated_meal_plan(
        generated_plan=generated_plan,
        recipes=recipes,
        existing_plan=meal_plan,
        request=request,
    )

    return generated_plan
