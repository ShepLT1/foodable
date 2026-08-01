from uuid import UUID
from datetime import timedelta, datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.meal_plan import MealPlan
from app.models.meal_plan_meal import MealPlanMeal
from app.models.recipe import Recipe
from app.models.common import MealType
from app.repositories.meal_plan import meal_plan_repository
from app.repositories.profile import profile_repository
from app.repositories.recipe import recipe_repository
from app.schemas.recipe import RecipeGenerateRequest
from app.schemas.meal_plan import (
    MealPlanCreate,
    MealPlanMealCreate,
    MealPlanMealUpdate,
    MealPlanUpdate,
    MealPlanGenerateRequest,
)
from app.schemas.meal_plan_ai import (
    ExistingMealPlan,
    ExistingRecipe,
    EmptyMealSlot,
    ExistingMeal
)
from app.services import meal_plan_ai
from app.services.recipe import create_recipe_for_user_without_commit

class MealPlanGenerationError(Exception):
    """Raised when AI meal plan generation fails."""

class MealPlanService:
    def _build_existing_recipe(
        self,
        recipe: Recipe,
    ) -> ExistingRecipe:
        """
        Convert a Recipe ORM model into the lightweight AI recipe representation.
        """
        ingredients = [ingredient["name"] for ingredient in recipe.ingredients_json]

        if not ingredients:
            raise ValueError(
                f"Recipe {recipe.id} ('{recipe.title}') has no ingredients."
            )

        return ExistingRecipe(
            id=recipe.id,
            title=recipe.title,
            description=recipe.description,
            meal_type=recipe.meal_type,
            cuisine_type=recipe.cuisine_type,
            ingredients=ingredients,
        )

    def _build_existing_meal_plan(
        self,
        meal_plan: MealPlan,
    ) -> ExistingMealPlan:
        existing_meals: list[ExistingMeal] = []
        empty_slots: list[EmptyMealSlot] = []

        for meal in meal_plan.meals:
            if (
                meal.scheduled_date is None
                or meal.meal_type is None
            ):
                continue

            existing_meals.append(
                ExistingMeal(
                    date=meal.scheduled_date,
                    meal_type=meal.meal_type,
                    recipe_id=meal.recipe_id,
                )
            )

        return ExistingMealPlan(
            title=meal_plan.title,
            existing_meals=existing_meals,
            empty_slots=empty_slots,
        )

    async def generate(
        self,
        db: AsyncSession,
        meal_plan_id: UUID,
        user_id: UUID,
        request: MealPlanGenerateRequest,
    ):
        """
        Generate or complete a meal plan using AI.
        """

        meal_plan = await meal_plan_repository.get_by_id(
            db,
            meal_plan_id,
            user_id,
        )

        if meal_plan is None:
            return None

        profile = await profile_repository.get_by_id(
            db,
            user_id,
        )

        if profile is None:
            raise ValueError(
                f"No profile found for user {user_id}"
            )

        recipes = await recipe_repository.get_all_by_user(
            db,
            user_id,
        )

        recipe_lookup = {
            recipe.id: recipe
            for recipe in recipes
        }

        existing_recipes = [
            self._build_existing_recipe(recipe)
            for recipe in recipes
        ]

        existing_plan = self._build_existing_meal_plan(
            meal_plan,
        )

        existing_lookup = {
            (meal.date, meal.meal_type)
            for meal in existing_plan.existing_meals
        }

        empty_slots: list[EmptyMealSlot] = []

        for day_offset in range(request.days):
            current_date = (
                request.start_date
                + timedelta(days=day_offset)
            )

            for meal_type in request.meal_types:
                key = (
                    current_date,
                    meal_type,
                )

                if key not in existing_lookup:
                    empty_slots.append(
                        EmptyMealSlot(
                            date=current_date,
                            meal_type=meal_type,
                        )
                    )

        existing_plan.empty_slots = empty_slots

        if not empty_slots:
            return meal_plan

        try:
            generated_plan = await meal_plan_ai.generate_meal_plan(
                profile=profile,
                recipes=existing_recipes,
                meal_plan=existing_plan,
                request=request,
            )
        except Exception as e:
            raise MealPlanGenerationError(
                "Failed to generate meal plan"
            ) from e

        generated_recipe_lookup: dict[
            tuple[str, MealType, str | None, tuple[str, ...]],
            UUID,
        ] = {}

        for day in generated_plan.days:
            for meal in day.meals:
                if meal.existing_recipe_id is not None:
                    continue

                assert meal.recipe_concept is not None

                cache_key = (
                    meal.recipe_concept.title.casefold(),
                    meal.meal_type,
                    (
                        meal.recipe_concept.cuisine.casefold()
                        if meal.recipe_concept.cuisine is not None
                        else None
                    ),
                    tuple(
                        ingredient.casefold()
                        for ingredient in sorted(
                            meal.recipe_concept.key_ingredients
                        )
                    ),
                )

                recipe_id = generated_recipe_lookup.get(cache_key)

                if recipe_id is None:
                    recipe_request = RecipeGenerateRequest(
                        title=meal.recipe_concept.title,
                        description=meal.recipe_concept.planning_notes,
                        ingredients=meal.recipe_concept.key_ingredients,
                        meal_type=meal.meal_type,
                        cuisine_type=meal.recipe_concept.cuisine,
                    )

                    try:
                        recipe = await create_recipe_for_user_without_commit(
                            db=db,
                            user_id=user_id,
                            request=recipe_request,
                        )
                    except Exception as e:
                        raise MealPlanGenerationError(
                            "Failed to generate recipe for meal plan"
                        ) from e

                    recipe_lookup[recipe.id] = recipe

                    recipe_id = recipe.id
                    generated_recipe_lookup[cache_key] = recipe_id

                meal.existing_recipe_id = recipe_id
                meal.recipe_concept = None

        new_meals: list[MealPlanMeal] = []

        for day in generated_plan.days:
            for meal in day.meals:
                assert meal.existing_recipe_id is not None

                recipe = recipe_lookup[meal.existing_recipe_id]

                new_meals.append(
                    MealPlanMeal(
                        meal_plan_id=meal_plan.id,
                        recipe_id=meal.existing_recipe_id,
                        servings=recipe.servings,
                        scheduled_date=day.date,
                        meal_type=meal.meal_type,
                    )
                )

        try:
            db.add_all(new_meals)

            meal_plan.updated_at = datetime.now(timezone.utc)

            await db.commit()

        except Exception:
            await db.rollback()
            raise

        refreshed = await meal_plan_repository.get_by_id(
            db,
            meal_plan.id,
            user_id,
        )

        assert refreshed is not None

        return refreshed
        

    async def create(
        self,
        db: AsyncSession,
        user_id: UUID,
        data: MealPlanCreate,
    ) -> MealPlan:
        return await meal_plan_repository.create(
            db,
            user_id,
            data,
        )

    async def get_all(
        self,
        db: AsyncSession,
        user_id: UUID,
        limit: int | None = None,
    ) -> list[MealPlan]:
        return await meal_plan_repository.get_all(db, user_id, limit)

    async def get_by_id(
        self,
        db: AsyncSession,
        meal_plan_id: UUID,
        user_id: UUID,
    ) -> MealPlan | None:
        return await meal_plan_repository.get_by_id(
            db,
            meal_plan_id,
            user_id,
        )

    async def update(
        self,
        db: AsyncSession,
        meal_plan_id: UUID,
        user_id: UUID,
        data: MealPlanUpdate,
    ) -> MealPlan | None:
        changes = data.model_dump(exclude_unset=True)

        if not changes:
            return await meal_plan_repository.get_by_id(
                db,
                meal_plan_id,
                user_id,
            )

        return await meal_plan_repository.update(
            db,
            meal_plan_id,
            user_id,
            changes,
        )

    async def delete(
        self,
        db: AsyncSession,
        meal_plan_id: UUID,
        user_id: UUID,
    ) -> bool:
        return await meal_plan_repository.delete(
            db,
            meal_plan_id,
            user_id,
        )

    async def add_meal(
        self,
        db: AsyncSession,
        meal_plan_id: UUID,
        user_id: UUID,
        data: MealPlanMealCreate,
    ) -> MealPlan | None:
        return await meal_plan_repository.add_meal(
            db,
            meal_plan_id,
            user_id,
            data,
        )

    async def update_meal(
        self,
        db: AsyncSession,
        meal_plan_id: UUID,
        meal_id: UUID,
        user_id: UUID,
        data: MealPlanMealUpdate,
    ) -> MealPlan | None:
        changes = data.model_dump(exclude_unset=True)

        if not changes:
            return await meal_plan_repository.get_by_id(
                db,
                meal_plan_id,
                user_id,
            )

        return await meal_plan_repository.update_meal(
            db,
            meal_plan_id,
            meal_id,
            user_id,
            changes,
        )

    async def delete_meal(
        self,
        db: AsyncSession,
        meal_plan_id: UUID,
        meal_id: UUID,
        user_id: UUID,
    ) -> MealPlan | None:
        return await meal_plan_repository.delete_meal(
            db,
            meal_plan_id,
            meal_id,
            user_id,
        )


meal_plan_service = MealPlanService()
