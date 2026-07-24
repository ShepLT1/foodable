from uuid import UUID

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate


class RecipeRepository:
    async def create(
        self,
        db: AsyncSession,
        data: RecipeCreate,
    ) -> Recipe:
        steps_json = {
            "steps": data.steps,
            "servings": data.servings,
            "tools_needed": data.tools_needed,
        }
        recipe = Recipe(
            user_id=data.user_id,
            title=data.title,
            description=data.description,
            meal_type=data.meal_type,
            cuisine_type=data.cuisine_type,
            steps_json=steps_json,
            ingredients_json=data.ingredients_json,
            nutrition_json=data.nutrition_json,
        )

        db.add(recipe)

        try:
            await db.commit()
            await db.refresh(recipe)
        except SQLAlchemyError:
            await db.rollback()
            raise

        return recipe

    async def get_by_id(
        self,
        db: AsyncSession,
        recipe_id: UUID,
        user_id: UUID,
    ) -> Recipe | None:
        result = await db.execute(
            select(Recipe).where(
                Recipe.id == recipe_id,
                Recipe.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()


recipe_repository = RecipeRepository()
