from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_user
from app.db.dependencies import get_db
from app.models.auth_user import AuthUser
from app.models.profile import Profile
from app.schemas import CurrentUser, ProfileUpdate, UserMe, UserPublic
from app.services.profile import profile_service

router = APIRouter(prefix="/users", tags=["users"])


# combine the profile row with the auth.users row (email, signup time)
def _to_user_me(profile: Profile, auth_user: AuthUser) -> UserMe:
    return UserMe(
        id=profile.id,
        display_name=profile.display_name,
        email=auth_user.email,
        created_at=auth_user.created_at,
        dietary_restrictions=profile.dietary_restrictions,
        allergies=profile.allergies,
        preferences=profile.preferences,
    )


@router.get("/me", response_model=UserMe)
async def get_me(
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserMe:
    profile = await profile_service.get_by_id(db, UUID(user.id))
    auth_user = await profile_service.get_auth_user(db, UUID(user.id))

    if profile is None or auth_user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")

    return _to_user_me(profile, auth_user)


@router.patch("/me", response_model=UserMe)
async def update_me(
    payload: ProfileUpdate,
    user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserMe:
    profile = await profile_service.update(db, UUID(user.id), payload)
    auth_user = await profile_service.get_auth_user(db, UUID(user.id))

    if profile is None or auth_user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Profile not found")

    return _to_user_me(profile, auth_user)


@router.get("/{user_id}", response_model=UserPublic)
async def get_user(
    user_id: UUID,
    _: CurrentUser = Depends(get_current_user),  # any authenticated user may view
    db: AsyncSession = Depends(get_db),
) -> Profile:
    profile = await profile_service.get_by_id(db, user_id)

    if profile is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    return profile
