from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from app.core.auth import get_current_user
from app.db.dependencies import get_db
from app.schemas import AuthUser, UserPublic
from app.services.profile import profile_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserPublic)
async def me(
    user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserPublic:
    profile = await profile_service.get_by_id(db, UUID(user.id))

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )

    return UserPublic(
        id=user.id,
        email=user.email,
        display_name=profile.display_name,
    )
