from uuid import UUID
from app.repositories.recipe import recipe_repository

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import CurrentUser, get_current_user
from app.db.dependencies import get_db
from app.schemas.recipe import RecipeGenerateRequest, RecipeResponse
from app.services.recipe import (
    ProfileNotFoundError,
    RecipeGenerationError,
    create_recipe_for_user,
)

router = APIRouter(prefix="/recipes", tags=["recipes"])


def _map_recipe_error(e: Exception) -> HTTPException:
    """Map a service-layer exception to the appropriate HTTP error."""
    if isinstance(e, ProfileNotFoundError):
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    if isinstance(e, RecipeGenerationError):
        return HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(e))
    raise e


@router.post("/generate", response_model=RecipeResponse)
async def generate_recipe_endpoint(
    payload: RecipeGenerateRequest,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RecipeResponse:
    try:
        recipe = await create_recipe_for_user(
            db,
            user_id=UUID(user.id),
            request=payload,
        )
    except (ProfileNotFoundError, RecipeGenerationError) as e:
        raise _map_recipe_error(e) from e

    return RecipeResponse.from_db_recipe(recipe)


@router.get("/{recipe_id}", response_model=RecipeResponse)
async def get_recipe_endpoint(
    recipe_id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> RecipeResponse:
    recipe = await recipe_repository.get_by_id(
        db,
        recipe_id=recipe_id,
        user_id=UUID(user.id),
    )

    if recipe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )

    return RecipeResponse.from_db_recipe(recipe)
