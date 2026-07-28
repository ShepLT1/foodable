from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profile import Profile
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate, RecipeSearchParams


class RecipeRepository:
    async def create(
        self,
        db: AsyncSession,
        data: RecipeCreate,
    ) -> Recipe:
        recipe = Recipe(
            user_id=data.user_id,
            title=data.title,
            description=data.description,
            meal_type=data.meal_type,
            cuisine_type=data.cuisine_type,
            servings=data.servings,
            tools_needed=data.tools_needed,
            steps_json=data.steps,
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

    async def get_by_ids(
        self,
        db: AsyncSession,
        recipe_ids: list[UUID],
        user_id: UUID,
    ) -> list[Recipe]:
        result = await db.execute(
            select(Recipe).where(
                Recipe.user_id == user_id,
                Recipe.id.in_(recipe_ids),
            )
        )

        return list(result.scalars().all())

    async def search(
        self,
        db: AsyncSession,
        params: RecipeSearchParams,
        current_user_id: UUID,
    ) -> tuple[list[tuple[Recipe, str]], int]:
        query = (
            select(Recipe, Profile.display_name)
            .join(Profile, Recipe.user_id == Profile.id)
            .where(Recipe.is_public.is_(True))
        )

        if params.exclude_own:
            query = query.where(Recipe.user_id != current_user_id)

        if params.q:
            query = query.where(Recipe.title.ilike(f"%{params.q}%"))

        if params.cuisine_type:
            query = query.where(Recipe.cuisine_type.ilike(params.cuisine_type))

        if params.meal_type:
            query = query.where(Recipe.meal_type.ilike(params.meal_type))

        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar_one()

        sort_column = Recipe.title if params.sort_by == "title" else Recipe.created_at
        order_fn = sort_column.asc() if params.order == "asc" else sort_column.desc()
        query = query.order_by(order_fn, Recipe.id)

        offset = (params.page - 1) * params.limit
        query = query.offset(offset).limit(params.limit)

        result = await db.execute(query)
        return [(row[0], row[1]) for row in result.all()], total


recipe_repository = RecipeRepository()
