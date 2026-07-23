from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.list import GroceryList
from app.repositories.list import lists_repository
from app.repositories.recipe import recipe_repository
from app.schemas.list import (
    GroceryListCreate,
    GroceryListUpdate,
    GroceryListItemCreate,
    GroceryListItemUpdate,
)
from app.schemas.list_ai import GroceryListGenerateRequest
from app.services.list_ai import generate_grocery_list

class RecipeSelectionError(Exception):
    """Raised when one or more requested recipes cannot be found."""

class ListService:
    async def create(
        self,
        db: AsyncSession,
        user_id: UUID,
        data: GroceryListCreate,
    ) -> GroceryList:
        return await lists_repository.create(db, user_id, data)

    async def generate_from_recipes(
        self,
        db: AsyncSession,
        user_id: UUID,
        data: GroceryListGenerateRequest,
    ) -> GroceryList:
        recipes = await recipe_repository.get_by_ids(
            db=db,
            recipe_ids=data.recipe_ids,
            user_id=user_id,
        )

        if len(recipes) != len(data.recipe_ids):
            raise RecipeSelectionError(
                "One or more recipes could not be found."
            )

        generated_list = await generate_grocery_list(
            recipes,
        )

        return await lists_repository.create_with_items(
            db=db,
            user_id=user_id,
            grocery_list=generated_list,
        )

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
