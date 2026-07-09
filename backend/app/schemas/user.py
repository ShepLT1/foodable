from pydantic import BaseModel


class AuthUser(BaseModel):
    id: str
    email: str


# TODO: add profile fields (display_name, etc.) once the DB query lands
class UserPublic(BaseModel):
    id: str
    email: str
    display_name: str
