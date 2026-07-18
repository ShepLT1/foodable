from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.list import GroceryList
from app.repositories.list import lists_repository
from app.schemas.list import (
    GroceryListCreate,
    GroceryListUpdate,
    GroceryListItemCreate,
    GroceryListItemUpdate,
)


class ListService:
    async def create(
        self,
        db: AsyncSession,
        user_id: UUID,
        data: GroceryListCreate,
    ) -> GroceryList:
        return await lists_repository.create(db, user_id, data)

    async def get_all(
        self,
        db: AsyncSession,
        user_id: UUID,
    ) -> list[GroceryList]:
        return await lists_repository.get_all(db, user_id)

    async def get_by_id(
        self,
        db: AsyncSession,
        list_id: UUID,
        user_id: UUID,
    ) -> GroceryList | None:
        return await lists_repository.get_by_id(
            db,
            list_id,
            user_id,
        )

    async def update(
        self,
        db: AsyncSession,
        list_id: UUID,
        user_id: UUID,
        data: GroceryListUpdate,
    ) -> GroceryList | None:
        changes = data.model_dump(exclude_unset=True)

        if not changes:
            return await lists_repository.get_by_id(
                db,
                list_id,
                user_id,
            )

        return await lists_repository.update(
            db,
            list_id,
            user_id,
            changes,
        )

    async def delete(
        self,
        db: AsyncSession,
        list_id: UUID,
        user_id: UUID,
    ) -> bool:
        return await lists_repository.delete(
            db,
            list_id,
            user_id,
        )

    async def add_item(
        self,
        db: AsyncSession,
        list_id: UUID,
        user_id: UUID,
        data: GroceryListItemCreate,
    ) -> GroceryList | None:
        return await lists_repository.add_item(
            db,
            list_id,
            user_id,
            data,
        )

    async def update_item(
        self,
        db: AsyncSession,
        list_id: UUID,
        item_id: UUID,
        user_id: UUID,
        data: GroceryListItemUpdate,
    ) -> GroceryList | None:
        changes = data.model_dump(exclude_unset=True)

        if not changes:
            return await lists_repository.get_by_id(
                db,
                list_id,
                user_id,
            )

        return await lists_repository.update_item(
            db,
            list_id,
            item_id,
            user_id,
            changes,
        )

    async def delete_item(
        self,
        db: AsyncSession,
        list_id: UUID,
        item_id: UUID,
        user_id: UUID,
    ) -> GroceryList | None:
        return await lists_repository.delete_item(
            db,
            list_id,
            item_id,
            user_id,
        )


list_service = ListService()
