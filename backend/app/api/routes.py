from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.schemas import AuthUser, UserPublic

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/me")
def me(user: AuthUser = Depends(get_current_user)) -> UserPublic:
    return UserPublic(id=user.id, email=user.email)
