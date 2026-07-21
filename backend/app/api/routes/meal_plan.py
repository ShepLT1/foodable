from datetime import date
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.core.auth import CurrentUser, get_current_user
from app.db.dependencies import get_db
from app.models.mealplan import MealPlan, MealSlot
from app.models.recipe import Recipe as DBRecipe
from app.schemas.mealplan import MealPlanResponse

router = APIRouter(prefix="/meal-plans", tags=["meal-plans"])


class CustomItemDetails(BaseModel):
    quantity: float | None = 1.0
    unit: str | None = "item"
    calories: float | None = None
    protein_g: float | None = None
    carbs_g: float | None = None
    fat_g: float | None = None


class MealPlanCreateRequest(BaseModel):
    date: date
    slot: str
    recipe_id: UUID | None = None
    custom_name: str | None = None
    custom_details: CustomItemDetails | None = None


class MealPlanUpdateRequest(BaseModel):
    custom_name: str | None = None
    recipe_id: UUID | None = None
    custom_details: CustomItemDetails | None = None


def _build_quick_recipe(
    user_id: UUID, title: str, details: CustomItemDetails, slot_name: str
) -> DBRecipe:
    ingredients_json = [
        {
            "name": title,
            "quantity": details.quantity if details.quantity is not None else 1.0,
            "unit": details.unit if details.unit else "item",
        }
    ]
    nutrition_json = {
        "calories": details.calories or 0,
        "protein_g": details.protein_g or 0,
        "carbs_g": details.carbs_g or 0,
        "fat_g": details.fat_g or 0,
    }
    steps_json = {
        "steps": ["Quick logged item"],
        "servings": 1,
        "tools_needed": [],
    }
    return DBRecipe(
        user_id=user_id,
        title=title,
        description="Quick logged item",
        meal_type=slot_name,
        steps_json=steps_json,
        ingredients_json=ingredients_json,
        nutrition_json=nutrition_json,
        is_public=False,
    )


@router.get("", response_model=list[MealPlanResponse])
async def get_meal_plans(
    startDate: date,
    endDate: date,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[MealPlanResponse]:
    result = await db.execute(
        select(MealPlan)
        .where(
            MealPlan.user_id == UUID(user.id),
            MealPlan.date >= startDate,
            MealPlan.date <= endDate,
        )
        .order_by(MealPlan.created_at.asc())
    )
    return list(result.scalars().all())


@router.post("", response_model=MealPlanResponse)
async def create_meal_plan_item(
    payload: MealPlanCreateRequest,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MealPlanResponse:
    user_uuid = UUID(user.id)

    try:
        slot_enum = MealSlot(payload.slot.lower())
    except ValueError:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            f"Invalid slot '{payload.slot}'.",
        )

    recipe_id = payload.recipe_id
    custom_name = payload.custom_name

    # Auto-generate a quick recipe row if item name + details were provided
    if custom_name and payload.custom_details:
        quick_recipe = _build_quick_recipe(
            user_uuid, custom_name, payload.custom_details, slot_enum.value
        )
        db.add(quick_recipe)
        await db.flush()
        recipe_id = quick_recipe.id
        custom_name = None

    meal_plan = MealPlan(
        user_id=user_uuid,
        date=payload.date,
        slot=slot_enum,
        recipe_id=recipe_id,
        custom_name=custom_name,
    )
    db.add(meal_plan)
    await db.commit()

    reloaded = await db.execute(select(MealPlan).where(MealPlan.id == meal_plan.id))
    return reloaded.scalar_one()


@router.patch("/{meal_plan_id}", response_model=MealPlanResponse)
async def update_meal_plan_item(
    meal_plan_id: UUID,
    payload: MealPlanUpdateRequest,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> MealPlanResponse:
    user_uuid = UUID(user.id)
    stmt = select(MealPlan).where(
        MealPlan.id == meal_plan_id,
        MealPlan.user_id == user_uuid,
    )
    item = (await db.execute(stmt)).scalar_one_or_none()
    if not item:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Meal plan item not found")

    if payload.recipe_id is not None:
        item.recipe_id = payload.recipe_id
        item.custom_name = None
    elif payload.custom_name is not None:
        if payload.custom_details:
            # Update existing quick item recipe or build a new one
            if item.recipe_id:
                recipe_stmt = select(DBRecipe).where(
                    DBRecipe.id == item.recipe_id, DBRecipe.user_id == user_uuid
                )
                existing_recipe = (await db.execute(recipe_stmt)).scalar_one_or_none()
                if existing_recipe:
                    existing_recipe.title = payload.custom_name
                    existing_recipe.ingredients_json = [
                        {
                            "name": payload.custom_name,
                            "quantity": payload.custom_details.quantity
                            if payload.custom_details.quantity is not None
                            else 1.0,
                            "unit": payload.custom_details.unit
                            if payload.custom_details.unit
                            else "item",
                        }
                    ]
                    existing_recipe.nutrition_json = {
                        "calories": payload.custom_details.calories or 0,
                        "protein_g": payload.custom_details.protein_g or 0,
                        "carbs_g": payload.custom_details.carbs_g or 0,
                        "fat_g": payload.custom_details.fat_g or 0,
                    }
                else:
                    quick_recipe = _build_quick_recipe(
                        user_uuid,
                        payload.custom_name,
                        payload.custom_details,
                        item.slot.value,
                    )
                    db.add(quick_recipe)
                    await db.flush()
                    item.recipe_id = quick_recipe.id
                    item.custom_name = None
            else:
                quick_recipe = _build_quick_recipe(
                    user_uuid,
                    payload.custom_name,
                    payload.custom_details,
                    item.slot.value,
                )
                db.add(quick_recipe)
                await db.flush()
                item.recipe_id = quick_recipe.id
                item.custom_name = None
        else:
            item.custom_name = payload.custom_name

    await db.commit()

    reloaded = await db.execute(select(MealPlan).where(MealPlan.id == meal_plan_id))
    return reloaded.scalar_one()


@router.delete("/{meal_plan_id}")
async def delete_meal_plan_item(
    meal_plan_id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = delete(MealPlan).where(
        MealPlan.id == meal_plan_id,
        MealPlan.user_id == UUID(user.id),
    )
    res = await db.execute(stmt)
    if res.rowcount == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Meal plan item not found")
    await db.commit()
    return {"id": str(meal_plan_id)}
