"""
Prompt constants for AI-generated grocery lists.

These descriptions are referenced by the grocery list generation prompt
to encourage consistent, deterministic structured output from Claude.
"""

TITLE_DESCRIPTION = (
    "Generate a concise, human-readable grocery list title based on the "
    "provided recipes. Prefer titles such as 'Weekly Dinner Grocery List' "
    "or 'Tacos & Chili Grocery List'."
)

NAME_DESCRIPTION = (
    "Normalize ingredient names when they clearly refer to the same "
    "ingredient. Use the most recognizable grocery store name. "
    "For example, prefer 'Green Onions' over 'Scallions' when appropriate."
)

QUANTITY_DESCRIPTION = (
    "Merge compatible ingredient quantities. Preserve decimal values when "
    "needed. Never change quantities except when combining duplicate "
    "ingredients."
)

UNIT_DESCRIPTION = (
    "Normalize compatible units when practical. Prefer common culinary "
    "units (for example, 16 oz + 1 lb becomes 1.5 lb). "
    "Do not perform unnecessary or ambiguous conversions."
)

RECIPES_DESCRIPTION = (
    "Include the titles of every recipe that contributed to this merged "
    "ingredient. Each recipe title should appear only once."
)

MERGE_RULES = """
Merge ingredients only when they clearly represent the same grocery item.

Merge:
- Yellow onion + onion
- Scallions + green onions (if clearly equivalent)
- 16 oz cheddar + 1 lb cheddar

Do not merge:
- Parmesan + mozzarella
- Salted butter + unsalted butter
- Garlic powder + fresh garlic
- Cilantro + parsley

If uncertain, keep ingredients separate.
"""