from pydantic import BaseModel


# patch update — only provided fields will be changed
class ProfileUpdate(BaseModel):
    display_name: str | None = None
    dietary_restrictions: list[str] | None = None
    allergies: list[str] | None = None
    preferences: list[str] | None = None
