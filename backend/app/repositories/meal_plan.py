from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.meal_plan import MealPlan
from app.models.meal_plan_meal import MealPlanMeal
from app.models.recipe import Recipe
from app.schemas.meal_plan import (
    MealPlanCreate,
    MealPlanMealCreate,
)


class RecipeNotFoundError(Exception):
    """Raised when a requested recipe does not exist or is not owned by the user."""


class MealPlanRepository:
    async def _get_recipe(
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

    async def create(
        self,
        db: AsyncSession,
        user_id: UUID,
        data: MealPlanCreate,
    ) -> MealPlan:
        meal_plan = MealPlan(
            user_id=user_id,
            title=data.title,
        )

        db.add(meal_plan)

        try:
            await db.commit()
            await db.refresh(meal_plan)
        except SQLAlchemyError:
            await db.rollback()
            raise

        return meal_plan

    async def get_all(
        self,
        db: AsyncSession,
        user_id: UUID,
    ) -> list[MealPlan]:
        result = await db.execute(
            select(MealPlan)
            .options(selectinload(MealPlan.meals).selectinload(MealPlanMeal.recipe))
            .where(MealPlan.user_id == user_id)
            .order_by(MealPlan.created_at.desc())
        )

        return list(result.scalars().all())

    async def get_by_id(
        self,
        db: AsyncSession,
        meal_plan_id: UUID,
        user_id: UUID,
    ) -> MealPlan | None:
        result = await db.execute(
            select(MealPlan)
            .execution_options(populate_existing=True)
            .options(selectinload(MealPlan.meals).selectinload(MealPlanMeal.recipe))
            .where(
                MealPlan.id == meal_plan_id,
                MealPlan.user_id == user_id,
            )
        )

        return result.scalar_one_or_none()

    async def update(
        self,
        db: AsyncSession,
        meal_plan_id: UUID,
        user_id: UUID,
        changes: dict,
    ) -> MealPlan | None:
        meal_plan = await self.get_by_id(
            db,
            meal_plan_id,
            user_id,
        )

        if meal_plan is None:
            return None

        for key, value in changes.items():
            setattr(meal_plan, key, value)

        meal_plan.updated_at = datetime.now(timezone.utc)

        try:
            await db.commit()
        except SQLAlchemyError:
            await db.rollback()
            raise

        return await self.get_by_id(
            db,
            meal_plan_id,
            user_id,
        )

    async def delete(
        self,
        db: AsyncSession,
        meal_plan_id: UUID,
        user_id: UUID,
    ) -> bool:
        meal_plan = await self.get_by_id(
            db,
            meal_plan_id,
            user_id,
        )

        if meal_plan is None:
            return False

        await db.delete(meal_plan)

        try:
            await db.commit()
        except SQLAlchemyError:
            await db.rollback()
            raise

        return True

    async def add_meal(
        self,
        db: AsyncSession,
        meal_plan_id: UUID,
        user_id: UUID,
        data: MealPlanMealCreate,
    ) -> MealPlan | None:
        meal_plan = await self.get_by_id(
            db,
            meal_plan_id,
            user_id,
        )

        if meal_plan is None:
            return None

        recipe = await self._get_recipe(
            db,
            data.recipe_id,
            user_id,
        )

        if recipe is None:
            raise RecipeNotFoundError(
                f"No recipe found with id={data.recipe_id} for user_id={user_id}"
            )

        meal = MealPlanMeal(
            meal_plan_id=meal_plan_id,
            recipe_id=data.recipe_id,
            servings=data.servings,
            scheduled_date=data.scheduled_date,
            meal_type=data.meal_type,
        )

        db.add(meal)

        meal_plan.updated_at = datetime.now(timezone.utc)

        try:
            await db.commit()
        except SQLAlchemyError:
            await db.rollback()
            raise

        return await self.get_by_id(
            db,
            meal_plan_id,
            user_id,
        )

    async def update_meal(
        self,
        db: AsyncSession,
        meal_plan_id: UUID,
        meal_id: UUID,
        user_id: UUID,
        changes: dict,
    ) -> MealPlan | None:
        meal_plan = await self.get_by_id(
            db,
            meal_plan_id,
            user_id,
        )

        if meal_plan is None:
            return None

        result = await db.execute(
            select(MealPlanMeal).where(
                MealPlanMeal.id == meal_id,
                MealPlanMeal.meal_plan_id == meal_plan_id,
            )
        )

        meal = result.scalar_one_or_none()

        if meal is None:
            return None

        for key, value in changes.items():
            setattr(meal, key, value)

        meal_plan.updated_at = datetime.now(timezone.utc)

        try:
            await db.commit()
        except SQLAlchemyError:
            await db.rollback()
            raise

        return await self.get_by_id(
            db,
            meal_plan_id,
            user_id,
        )

    async def delete_meal(
        self,
        db: AsyncSession,
        meal_plan_id: UUID,
        meal_id: UUID,
        user_id: UUID,
    ) -> MealPlan | None:
        meal_plan = await self.get_by_id(
            db,
            meal_plan_id,
            user_id,
        )

        if meal_plan is None:
            return None

        result = await db.execute(
            select(MealPlanMeal).where(
                MealPlanMeal.id == meal_id,
                MealPlanMeal.meal_plan_id == meal_plan_id,
            )
        )

        meal = result.scalar_one_or_none()

        if meal is None:
            return None

        await db.delete(meal)

        meal_plan.updated_at = datetime.now(timezone.utc)

        try:
            await db.commit()
        except SQLAlchemyError:
            await db.rollback()
            raise

        return await self.get_by_id(
            db,
            meal_plan_id,
            user_id,
        )


meal_plan_repository = MealPlanRepository()
