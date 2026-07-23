from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import CurrentUser, get_current_user
from app.db.dependencies import get_db
from app.repositories.meal_plan import RecipeNotFoundError
from app.schemas.meal_plan import (
    DeleteMealPlanResponse,
    MealPlanCreate,
    MealPlanMealCreate,
    MealPlanMealUpdate,
    MealPlanResponse,
    MealPlanUpdate,
)
from app.services.meal_plan import meal_plan_service

router = APIRouter(prefix="/meal-plans", tags=["meal-plans"])


@router.get("", response_model=list[MealPlanResponse])
async def get_meal_plans(
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[MealPlanResponse]:
    meal_plans = await meal_plan_service.get_all(
        db=db,
        user_id=UUID(user.id),
    )

    return [MealPlanResponse.from_db_meal_plan(meal_plan) for meal_plan in meal_plans]


@router.get("/{meal_plan_id}", response_model=MealPlanResponse)
async def get_meal_plan(
    meal_plan_id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MealPlanResponse:
    meal_plan = await meal_plan_service.get_by_id(
        db=db,
        meal_plan_id=meal_plan_id,
        user_id=UUID(user.id),
    )

    if meal_plan is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "Meal plan not found",
        )

    return MealPlanResponse.from_db_meal_plan(meal_plan)


@router.post("", response_model=MealPlanResponse)
async def create_meal_plan(
    payload: MealPlanCreate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MealPlanResponse:
    meal_plan = await meal_plan_service.create(
        db=db,
        user_id=UUID(user.id),
        data=payload,
    )

    return MealPlanResponse.from_db_meal_plan(meal_plan)


@router.patch("/{meal_plan_id}", response_model=MealPlanResponse)
async def update_meal_plan(
    meal_plan_id: UUID,
    payload: MealPlanUpdate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MealPlanResponse:
    meal_plan = await meal_plan_service.update(
        db=db,
        meal_plan_id=meal_plan_id,
        user_id=UUID(user.id),
        data=payload,
    )

    if meal_plan is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "Meal plan not found",
        )

    return MealPlanResponse.from_db_meal_plan(meal_plan)


@router.delete(
    "/{meal_plan_id}",
    response_model=DeleteMealPlanResponse,
)
async def delete_meal_plan(
    meal_plan_id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DeleteMealPlanResponse:
    deleted = await meal_plan_service.delete(
        db=db,
        meal_plan_id=meal_plan_id,
        user_id=UUID(user.id),
    )

    if not deleted:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "Meal plan not found",
        )

    return DeleteMealPlanResponse(id=meal_plan_id)


@router.post(
    "/{meal_plan_id}/meals",
    response_model=MealPlanResponse,
)
async def add_meal(
    meal_plan_id: UUID,
    payload: MealPlanMealCreate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MealPlanResponse:
    try:
        meal_plan = await meal_plan_service.add_meal(
            db=db,
            meal_plan_id=meal_plan_id,
            user_id=UUID(user.id),
            data=payload,
        )
    except RecipeNotFoundError as e:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "Recipe not found",
        ) from e

    if meal_plan is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "Meal plan not found",
        )

    return MealPlanResponse.from_db_meal_plan(meal_plan)


@router.patch(
    "/{meal_plan_id}/meals/{meal_id}",
    response_model=MealPlanResponse,
)
async def update_meal(
    meal_plan_id: UUID,
    meal_id: UUID,
    payload: MealPlanMealUpdate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MealPlanResponse:
    meal_plan = await meal_plan_service.update_meal(
        db=db,
        meal_plan_id=meal_plan_id,
        meal_id=meal_id,
        user_id=UUID(user.id),
        data=payload,
    )

    if meal_plan is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "Meal plan or meal not found",
        )

    return MealPlanResponse.from_db_meal_plan(meal_plan)


@router.delete(
    "/{meal_plan_id}/meals/{meal_id}",
    response_model=MealPlanResponse,
)
async def delete_meal(
    meal_plan_id: UUID,
    meal_id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MealPlanResponse:
    meal_plan = await meal_plan_service.delete_meal(
        db=db,
        meal_plan_id=meal_plan_id,
        meal_id=meal_id,
        user_id=UUID(user.id),
    )

    if meal_plan is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "Meal plan or meal not found",
        )

    return MealPlanResponse.from_db_meal_plan(meal_plan)
