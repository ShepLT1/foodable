from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.list import GroceryList
from app.models.list_item import GroceryListItem
from app.schemas.list import (
    GroceryListCreate,
    GroceryListItemCreate,
)


class ListsRepository:
    async def create(
        self,
        db: AsyncSession,
        user_id: UUID,
        data: GroceryListCreate,
    ) -> GroceryList:
        grocery_list = GroceryList(
            user_id=user_id,
            title=data.title,
        )

        db.add(grocery_list)

        await db.commit()

        return await self.get_by_id(
            db,
            grocery_list.id,
            user_id,
        )
    
    
    async def get_all(
        self,
        db: AsyncSession,
        user_id: UUID,
    ) -> list[GroceryList]:
        result = await db.execute(
            select(GroceryList)
            .options(selectinload(GroceryList.items))
            .where(GroceryList.user_id == user_id)
            .order_by(GroceryList.created_at.desc())
        )

        return list(result.scalars().all())


    async def get_by_id(
        self,
        db: AsyncSession,
        list_id: UUID,
        user_id: UUID,
    ) -> GroceryList | None:
        result = await db.execute(
            select(GroceryList)
            .execution_options(populate_existing=True)
            .options(selectinload(GroceryList.items))
            .where(
                GroceryList.id == list_id,
                GroceryList.user_id == user_id,
            )
        )

        return result.scalar_one_or_none()
    

    async def update(
        self,
        db: AsyncSession,
        list_id: UUID,
        user_id: UUID,
        changes: dict,
    ) -> GroceryList | None:
        grocery_list = await self.get_by_id(
            db,
            list_id,
            user_id,
        )

        if grocery_list is None:
            return None

        for key, value in changes.items():
            setattr(grocery_list, key, value)

        await db.commit()

        return await self.get_by_id(
            db,
            grocery_list.id,
            user_id,
        )
    

    async def delete(
        self,
        db: AsyncSession,
        list_id: UUID,
        user_id: UUID,
    ) -> bool:
        grocery_list = await self.get_by_id(
            db,
            list_id,
            user_id,
        )

        if grocery_list is None:
            return False

        await db.delete(grocery_list)
        await db.commit()

        return True
    

    async def add_item(
        self,
        db: AsyncSession,
        list_id: UUID,
        user_id: UUID,
        data: GroceryListItemCreate,
    ) -> GroceryList | None:
        grocery_list = await self.get_by_id(
            db,
            list_id,
            user_id,
        )

        if grocery_list is None:
            return None

        item = GroceryListItem(
            list_id=list_id,
            name=data.name,
            quantity=data.quantity,
            unit=data.unit,
            checked=False,
        )

        db.add(item)

        await db.commit()

        return await self.get_by_id(
            db,
            list_id,
            user_id,
        )
    

    async def update_item(
        self,
        db: AsyncSession,
        list_id: UUID,
        item_id: UUID,
        user_id: UUID,
        changes: dict,
    ) -> GroceryList | None:
        result = await db.execute(
            select(GroceryListItem)
            .join(GroceryList)
            .where(
                GroceryListItem.id == item_id,
                GroceryList.id == list_id,
                GroceryList.user_id == user_id,
            )
        )

        item = result.scalar_one_or_none()

        if item is None:
            return None

        for key, value in changes.items():
            setattr(item, key, value)

        await db.commit()

        return await self.get_by_id(
            db,
            list_id,
            user_id,
        )
    

    async def delete_item(
        self,
        db: AsyncSession,
        list_id: UUID,
        item_id: UUID,
        user_id: UUID,
    ) -> GroceryList | None:
        result = await db.execute(
            select(GroceryListItem)
            .join(GroceryList)
            .where(
                GroceryListItem.id == item_id,
                GroceryList.id == list_id,
                GroceryList.user_id == user_id,
            )
        )

        item = result.scalar_one_or_none()

        if item is None:
            return None

        await db.delete(item)

        await db.commit()

        return await self.get_by_id(
            db,
            list_id,
            user_id,
        )
    
lists_repository = ListsRepository()