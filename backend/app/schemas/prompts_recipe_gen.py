UNIT_DESCRIPTION = (
    "A measurement unit like 'cup', 'tbsp', 'lb', 'oz', or "
    "'clove'. Omit this field entirely (do not use placeholder "
    "values like 'whole' or 'count') if the ingredient is just "
    "a countable whole item, such as '2 eggs' or '1 onion'. "
    "Never use size descriptors like 'medium' or 'large'. "
    "Prefer smaller, more precise units over awkward fractions: "
    "use tablespoons instead of fractional cups below 1/4 cup, "
    "and teaspoons instead of fractional tablespoons below 1/2 "
    "tbsp. For amounts smaller than 1/8 teaspoon, use 'pinch' "
    "as the unit with an amount of 1. "
    "Assume the user does not own a kitchen scale: prefer "
    "US customary volume units (cups, tablespoons, teaspoons) "
    "or common count-based units (sticks of butter, slices) "
    "over metric weight units like grams, unless the "
    "ingredient is conventionally sold and measured by weight "
    "(such as a 14 oz can of tomatoes or a 1 lb package of "
    "pasta)."
)

STEP_INSTRUCTION_DESCRIPTION = (
    "A single instruction in the recipe's preparation. If a "
    "temperature is mentioned, state it in Fahrenheit only — "
    "do not include a Celsius conversion."
)

CARBS_DESCRIPTION = (
    "Total carbohydrates in grams, per serving. Use a low "
    "number like 0-5 if the recipe is genuinely low-carb, "
    "rather than omitting this value."
)

TOOLS_NEEDED_DESCRIPTION = (
    "A list of kitchen tools/equipment required to make this "
    "recipe, such as 'oven', 'large skillet', 'mixing bowl', "
    "or 'blender'."
)

STEP_INGREDIENTS_DESCRIPTION = (
    "Names of ingredients used in this specific step. Should "
    "match ingredient names from the recipe's main ingredients "
    "list."
)

STEP_DURATION_DESCRIPTION = (
    "Estimated time in minutes to complete this step, if the "
    "step involves active or passive waiting time (e.g. "
    "baking, simmering, resting). Omit for quick steps with "
    "no meaningful duration."
)
