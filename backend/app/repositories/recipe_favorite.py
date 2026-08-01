from typing import Any
from uuid import UUID

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.recipe_favorite import RecipeFavorite


class RecipeFavoriteRepository:
    async def favorite(self, db: AsyncSession, user_id: UUID, recipe_id: UUID) -> bool:
        existing = await db.execute(
            select(RecipeFavorite).where(
                RecipeFavorite.user_id == user_id,
                RecipeFavorite.recipe_id == recipe_id,
            )
        )
        if existing.scalar_one_or_none():
            return True

        favorite = RecipeFavorite(user_id=user_id, recipe_id=recipe_id)
        db.add(favorite)
        await db.commit()
        return True

    async def unfavorite(
        self, db: AsyncSession, user_id: UUID, recipe_id: UUID
    ) -> bool:
        stmt = delete(RecipeFavorite).where(
            RecipeFavorite.user_id == user_id,
            RecipeFavorite.recipe_id == recipe_id,
        )
        result = await db.execute(stmt)
        await db.commit()
        return cast_rowcount(result) > 0

    async def is_favorited(
        self, db: AsyncSession, user_id: UUID, recipe_id: UUID
    ) -> bool:
        stmt = select(RecipeFavorite).where(
            RecipeFavorite.user_id == user_id,
            RecipeFavorite.recipe_id == recipe_id,
        )
        return (await db.execute(stmt)).scalar_one_or_none() is not None

    async def count_for_recipe(self, db: AsyncSession, recipe_id: UUID) -> int:
        stmt = (
            select(func.count())
            .select_from(RecipeFavorite)
            .where(RecipeFavorite.recipe_id == recipe_id)
        )
        return (await db.execute(stmt)).scalar() or 0


def cast_rowcount(result: Any) -> int:
    return getattr(result, "rowcount", 0)


recipe_favorite_repository = RecipeFavoriteRepository()
