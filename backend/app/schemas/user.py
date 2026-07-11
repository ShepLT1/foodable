from uuid import UUID

from pydantic import BaseModel, ConfigDict


# token identity from the JWT — no DB
class AuthUser(BaseModel):
    id: str
    email: str


# public view of a user — non-personal fields only
class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # build from the ORM Profile

    id: UUID
    display_name: str


# the owner's own view — adds email (from the JWT) and personal fields
class UserMe(UserPublic):
    email: str
    dietary_restrictions: list[str]
    allergies: list[str]
    preferences: list[str]
