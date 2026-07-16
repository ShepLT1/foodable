from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import CurrentUser, get_current_user
from app.db.dependencies import get_db
from app.schemas.list import (
    GroceryListCreate,
    GroceryListUpdate,
    GroceryListResponse,
    GroceryListItemCreate,
    GroceryListItemUpdate,
)
from app.services.list import list_service

router = APIRouter(prefix="/lists", tags=["lists"])


@router.get("", response_model=list[GroceryListResponse])
async def get_grocery_lists(
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[GroceryListResponse]:
    lists = await list_service.get_all(
        db=db,
        user_id=UUID(user.id),
    )
    return [GroceryListResponse.model_validate(x) for x in lists]


@router.get("/{list_id}", response_model=GroceryListResponse)
async def get_grocery_list(
    list_id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> GroceryListResponse:
    grocery_list = await list_service.get_by_id(
        db=db,
        list_id=list_id,
        user_id=UUID(user.id),
    )

    if grocery_list is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "Grocery list not found",
        )

    return GroceryListResponse.model_validate(grocery_list)


@router.post("", response_model=GroceryListResponse)
async def create_grocery_list(
    payload: GroceryListCreate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> GroceryListResponse:
    grocery_list = await list_service.create(
        db=db,
        user_id=UUID(user.id),
        data=payload,
    )

    return GroceryListResponse.model_validate(grocery_list)


@router.patch("/{list_id}", response_model=GroceryListResponse)
async def update_grocery_list(
    list_id: UUID,
    payload: GroceryListUpdate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> GroceryListResponse:
    grocery_list = await list_service.update(
        db=db,
        list_id=list_id,
        user_id=UUID(user.id),
        data=payload,
    )

    if grocery_list is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "Grocery list not found",
        )

    return GroceryListResponse.model_validate(grocery_list)


@router.delete("/{list_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_grocery_list(
    list_id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    deleted = await list_service.delete(
        db=db,
        list_id=list_id,
        user_id=UUID(user.id),
    )

    if not deleted:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "Grocery list not found",
        )


@router.post(
    "/{list_id}/items",
    response_model=GroceryListResponse,
)
async def add_item(
    list_id: UUID,
    payload: GroceryListItemCreate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> GroceryListResponse:
    grocery_list = await list_service.add_item(
        db=db,
        list_id=list_id,
        user_id=UUID(user.id),
        data=payload,
    )

    if grocery_list is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "Grocery list not found",
        )

    return GroceryListResponse.model_validate(grocery_list)


@router.patch(
    "/{list_id}/items/{item_id}",
    response_model=GroceryListResponse,
)
async def update_item(
    list_id: UUID,
    item_id: UUID,
    payload: GroceryListItemUpdate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> GroceryListResponse:
    grocery_list = await list_service.update_item(
        db=db,
        list_id=list_id,
        item_id=item_id,
        user_id=UUID(user.id),
        data=payload,
    )

    if grocery_list is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "Grocery list or item not found",
        )

    return GroceryListResponse.model_validate(grocery_list)


@router.delete(
    "/{list_id}/items/{item_id}",
    response_model=GroceryListResponse,
)
async def delete_item(
    list_id: UUID,
    item_id: UUID,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> GroceryListResponse:
    grocery_list = await list_service.delete_item(
        db=db,
        list_id=list_id,
        item_id=item_id,
        user_id=UUID(user.id),
    )

    if grocery_list is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND,
            "Grocery list or item not found",
        )

    return GroceryListResponse.model_validate(grocery_list)
