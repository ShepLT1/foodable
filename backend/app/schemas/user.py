from pydantic import BaseModel


class AuthUser(BaseModel):
    id: str
    email: str


class UserPublic(BaseModel):
    id: str
    email: str
    display_name: str
