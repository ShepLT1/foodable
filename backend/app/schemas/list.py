from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class GroceryListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    quantity: Decimal | None
    unit: str | None
    checked: bool


class GroceryListItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    quantity: Decimal | None = None
    unit: str | None = Field(default=None, max_length=50)


class GroceryListItemUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=200)
    quantity: Decimal | None = None
    unit: str | None = Field(default=None, max_length=50)
    checked: bool | None = None


class GroceryListCreate(BaseModel):
    title: str = Field(min_length=1, max_length=100)


class GroceryListUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=100)


class GroceryListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    title: str
    items: list[GroceryListItem]
    created_at: datetime
    updated_at: datetime


class DeleteGroceryListResponse(BaseModel):
    id: UUID
