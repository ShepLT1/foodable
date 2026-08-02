from datetime import datetime, timezone
from uuid import uuid4

# Import related models so SQLAlchemy can resolve Recipe's relationships
# (mappers configure lazily on first instantiation).
from app.models import meal_plan, meal_plan_meal  # noqa: F401
from app.models.profile import Profile
from app.models.recipe import Recipe
from app.repositories.recipe import RecipeRow
from app.schemas.recipe import RecipeResponse

NUTRITION = {
    "calories": 420,
    "protein_g": 18,
    "carbs_g": 45,
    "fat_g": 12,
    "explanation": "Balanced.",
}
STEPS = [{"instruction": "Chop", "ingredients": ["broccoli"]}]
INGREDIENTS = [{"name": "broccoli", "quantity": 1, "unit": "head"}]


def _recipe(user_id):
    return Recipe(
        id=uuid4(),
        user_id=user_id,
        title="Veggie Stir Fry",
        description="Quick.",
        meal_type="dinner",
        cuisine_type="asian",
        servings=2,
        tools_needed=["wok"],
        steps_json=STEPS,
        ingredients_json=INGREDIENTS,
        nutrition_json=NUTRITION,
        is_public=True,
        created_at=datetime.now(timezone.utc),
    )


def test_from_row_populates_creator_and_is_favorited():
    author_id = uuid4()
    recipe = _recipe(author_id)
    author = Profile(id=author_id, display_name="Chef Mario")

    response = RecipeResponse.from_row(
        RecipeRow(recipe=recipe, author=author, is_favorited=True)
    )

    assert response.is_favorited is True
    assert response.creator is not None
    assert response.creator.id == author_id
    assert response.creator.display_name == "Chef Mario"
    assert response.title == "Veggie Stir Fry"


def test_from_db_recipe_defaults_no_creator_not_favorited():
    recipe = _recipe(uuid4())

    response = RecipeResponse.from_db_recipe(recipe)

    assert response.is_favorited is False
    assert response.creator is None
