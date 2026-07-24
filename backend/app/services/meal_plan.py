from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.meal_plan import MealPlan
from app.repositories.meal_plan import meal_plan_repository
from app.schemas.meal_plan import (
    MealPlanCreate,
    MealPlanMealCreate,
    MealPlanMealUpdate,
    MealPlanUpdate,
)


class MealPlanService:
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
    ) -> list[MealPlan]:
        return await meal_plan_repository.get_all(
            db,
            user_id,
        )

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
