from datetime import date
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import CurrentUser, get_current_user
from app.db.dependencies import get_db
from app.models.mealplan import MealPlan
from app.schemas.mealplan import MealPlanResponse

router = APIRouter(prefix="/meal-plans", tags=["meal-plans"])


@router.get("", response_model=list[MealPlanResponse])
async def get_meal_plans(
    startDate: date,  # <-- Change from str to date
    endDate: date,    # <-- Change from str to date
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[MealPlanResponse]:
    result = await db.execute(
        select(MealPlan)
        .where(
            MealPlan.user_id == UUID(user.id),
            MealPlan.date >= startDate,  # Now compares date >= date
            MealPlan.date <= endDate,    # Now compares date <= date
        )
        .order_by(MealPlan.date.asc())
    )
    return list(result.scalars().all())