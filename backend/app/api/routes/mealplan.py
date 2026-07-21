from datetime import date
from typing import Any, cast
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import delete, select
from sqlalchemy.engine import CursorResult
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import CurrentUser, get_current_user
from app.db.dependencies import get_db
from app.models.mealplan import MealPlan, MealSlot
from app.models.recipe import Recipe
from app.schemas.mealplan import (
    MealPlanCreate,
    MealPlanResponse,
    MealPlanUpdate,
)

router = APIRouter(prefix="/meal-plans", tags=["Meal Plans"])


@router.get("", response_model=list[MealPlanResponse])
async def get_meal_plans(
    startDate: date = Query(...),
    endDate: date = Query(...),
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[MealPlanResponse]:
    """Fetch meal plan entries for the current user within a date range."""
    stmt = (
        select(MealPlan)
        .where(
            MealPlan.user_id == UUID(user.id),
            MealPlan.date >= startDate,
            MealPlan.date <= endDate,
        )
        .order_by(MealPlan.date.asc(), MealPlan.slot.asc())
    )
    result = await db.execute(stmt)
    meal_plans = result.scalars().all()

    return [MealPlanResponse.model_validate(m) for m in meal_plans]


@router.post("", response_model=MealPlanResponse, status_code=status.HTTP_201_CREATED)
async def create_meal_plan_item(
    payload: MealPlanCreate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MealPlanResponse:
    """Create a new meal plan item (recipe reference or quick custom item)."""
    try:
        slot_enum = MealSlot(payload.slot.lower())
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
           detail=(
                f"Invalid slot '{payload.slot}'. "
                "Must be breakfast, lunch, dinner, or snack."
            ))

    if payload.recipe_id:
        recipe_stmt = select(Recipe).where(Recipe.id == payload.recipe_id)
        recipe_result = await db.execute(recipe_stmt)
        recipe_obj = recipe_result.scalar_one_or_none()
        if not recipe_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Referenced recipe not found.",
            )

    meal_plan = MealPlan(
        user_id=UUID(user.id),
        date=payload.date,
        slot=slot_enum,
        recipe_id=payload.recipe_id,
        custom_name=payload.custom_name,
    )

    db.add(meal_plan)
    await db.commit()
    await db.refresh(meal_plan)

    return MealPlanResponse.model_validate(meal_plan)


@router.patch("/{item_id}", response_model=MealPlanResponse)
async def update_meal_plan_item(
    item_id: UUID,
    payload: MealPlanUpdate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MealPlanResponse:
    """Update an existing meal plan item."""
    stmt = select(MealPlan).where(
        MealPlan.id == item_id,
        MealPlan.user_id == UUID(user.id),
    )
    result = await db.execute(stmt)
    meal_plan = result.scalar_one_or_none()

    if not meal_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan item not found.",
        )

    if payload.slot is not None:
        try:
            meal_plan.slot = MealSlot(payload.slot.lower())
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid slot '{payload.slot}'.",
            )

    if payload.date is not None:
        meal_plan.date = payload.date

    if payload.recipe_id is not None or payload.custom_name is not None:
        if payload.recipe_id:
            recipe_stmt = select(Recipe).where(Recipe.id == payload.recipe_id)
            recipe_result = await db.execute(recipe_stmt)
            recipe_obj = recipe_result.scalar_one_or_none()
            if not recipe_obj:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Referenced recipe not found.",
                )
            meal_plan.recipe_id = payload.recipe_id
            meal_plan.custom_name = None
        else:
            meal_plan.custom_name = payload.custom_name
            meal_plan.recipe_id = None

    await db.commit()
    await db.refresh(meal_plan)

    return MealPlanResponse.model_validate(meal_plan)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_meal_plan_item(
    item_id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete a meal plan item."""
    stmt = delete(MealPlan).where(
        MealPlan.id == item_id,
        MealPlan.user_id == UUID(user.id),
    )
    result = await db.execute(stmt)
    cursor_result = cast(CursorResult[Any], result)

    if cursor_result.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meal plan item not found.",
        )

    await db.commit()
