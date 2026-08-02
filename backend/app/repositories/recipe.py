from typing import NamedTuple
from uuid import UUID

from sqlalchemy import exists, func, or_, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profile import Profile
from app.models.recipe import Recipe
from app.models.recipe_favorite import RecipeFavorite
from app.schemas.recipe import RecipeCreate, RecipeSearchParams


# One row of the shared recipe read query: the recipe, its creator's profile,
# and whether the requesting user has favorited it.
class RecipeRow(NamedTuple):
    recipe: Recipe
    creator: Profile
    is_favorited: bool


def _recipe_rows(current_user_id: UUID):
    """Base select every recipe read path shares: recipe + creator + favorited."""
    is_favorited = (
        exists()
        .where(
            RecipeFavorite.recipe_id == Recipe.id,
            RecipeFavorite.user_id == current_user_id,
        )
        .label("is_favorited")
    )
    return select(Recipe, Profile, is_favorited).join(
        Profile, Recipe.user_id == Profile.id
    )


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

    async def create_without_commit(
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

        await db.flush()

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
                or_(Recipe.user_id == user_id, Recipe.is_public.is_(True)),
            )
        )
        return result.scalar_one_or_none()

    async def get_by_user_id(
        self,
        db: AsyncSession,
        user_id: UUID,
        limit: int,
        offset: int,
    ) -> list[Recipe]:
        result = await db.execute(
            select(Recipe)
            .where(Recipe.user_id == user_id)
            .order_by(Recipe.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())

    async def count_by_user_id(self, db: AsyncSession, user_id: UUID) -> int:
        result = await db.execute(
            select(func.count()).select_from(Recipe).where(Recipe.user_id == user_id)
        )
        return result.scalar() or 0

    async def get_detail(
        self,
        db: AsyncSession,
        recipe_id: UUID,
        current_user_id: UUID,
    ) -> RecipeRow | None:
        query = _recipe_rows(current_user_id).where(
            Recipe.id == recipe_id,
            or_(Recipe.user_id == current_user_id, Recipe.is_public.is_(True)),
        )
        row = (await db.execute(query)).first()
        if row is None:
            return None
        return RecipeRow(recipe=row[0], creator=row[1], is_favorited=row[2])

    async def list_public_by_user(
        self,
        db: AsyncSession,
        user_id: UUID,
        current_user_id: UUID,
        limit: int,
        offset: int,
    ) -> list[RecipeRow]:
        query = (
            _recipe_rows(current_user_id)
            .where(
                Recipe.user_id == user_id,
                Recipe.is_public.is_(True),
            )
            .order_by(Recipe.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        rows = (await db.execute(query)).all()
        return [RecipeRow(recipe=r[0], creator=r[1], is_favorited=r[2]) for r in rows]

    async def count_public_by_user_id(
        self,
        db: AsyncSession,
        user_id: UUID,
    ) -> int:
        result = await db.execute(
            select(func.count())
            .select_from(Recipe)
            .where(
                Recipe.user_id == user_id,
                Recipe.is_public.is_(True),
            )
        )
        return result.scalar() or 0

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

    async def get_all_by_user(
        self,
        db: AsyncSession,
        user_id: UUID,
    ) -> list[Recipe]:
        result = await db.execute(
            select(Recipe).where(Recipe.user_id == user_id).order_by(Recipe.title.asc())
        )

        return list(result.scalars().all())

    async def search(
        self,
        db: AsyncSession,
        params: RecipeSearchParams,
        current_user_id: UUID,
    ) -> tuple[list[RecipeRow], int]:
        query = _recipe_rows(current_user_id).where(Recipe.is_public.is_(True))

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

        rows = (await db.execute(query)).all()
        return [
            RecipeRow(recipe=r[0], creator=r[1], is_favorited=r[2]) for r in rows
        ], total


recipe_repository = RecipeRepository()
