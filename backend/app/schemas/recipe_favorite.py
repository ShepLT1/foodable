from pydantic import BaseModel


class FavoriteActionResponse(BaseModel):
    success: bool
    message: str
