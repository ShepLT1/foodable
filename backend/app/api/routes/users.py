from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.db.dependencies import get_db
from app.models.profile import Profile
from app.schemas import AuthUser, ProfileUpdate, UserMe, UserPublic
from app.services.profile import profile_service

router = APIRouter(prefix="/users", tags=["users"])


# merge the JWT identity (email) with the profile row
def _to_user_me(user: AuthUser, profile: Profile) -> UserMe:
    return UserMe(
        id=profile.id,
        display_name=profile.display_name,
        email=user.email,
        dietary_restrictions=profile.dietary_restrictions,
        allergies=profile.allergies,
        preferences=profile.preferences,
    )


@router.get("/me", response_model=UserMe)
async def get_me(
    user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserMe:
    profile = await profile_service.get_by_id(db, UUID(user.id))

    if profile is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")

    return _to_user_me(user, profile)


@router.patch("/me", response_model=UserMe)
async def update_me(
    payload: ProfileUpdate,
    user: AuthUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserMe:
    profile = await profile_service.update(db, UUID(user.id), payload)

    if profile is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")

    return _to_user_me(user, profile)


@router.get("/{user_id}", response_model=UserPublic)
async def get_user(
    user_id: UUID,
    _: AuthUser = Depends(get_current_user),  # any authenticated user may view
    db: AsyncSession = Depends(get_db),
) -> Profile:
    profile = await profile_service.get_by_id(db, user_id)

    if profile is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    return profile
