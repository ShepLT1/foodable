from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


# token identity from the JWT — no DB
class CurrentUser(BaseModel):
    id: str
    email: str


# public view of a user — non-personal fields only
class UserPublic(BaseModel):
    id: UUID
    display_name: str
    created_at: datetime  # signup time, from auth.users


# the owner's own view — adds email (from the JWT) and personal fields
class UserMe(UserPublic):
    email: str
    dietary_restrictions: list[str]
    allergies: list[str]
    preferences: list[str]
    onboarded_at: datetime | None
