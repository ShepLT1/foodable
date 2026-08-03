from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import CurrentUser, get_current_user
from app.db.dependencies import get_db
from app.models.auth_user import AuthUser
from app.models.profile import Profile
from app.repositories.recipe import recipe_repository
from app.repositories.user_follow import user_follow_repository
from app.schemas import ProfileUpdate, UserMe, UserPublic
from app.schemas.recipe import PaginatedRecipes, RecipeResponse
from app.schemas.user_follow import (
    FollowActionResponse,
    FollowStatsResponse,
    FollowUserSummary,
)
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
        onboarded_at=profile.onboarded_at,
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
) -> UserPublic:
    profile = await profile_service.get_by_id(db, user_id)
    auth_user = await profile_service.get_auth_user(db, user_id)

    if profile is None or auth_user is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")

    return UserPublic(
        id=profile.id,
        display_name=profile.display_name,
        created_at=auth_user.created_at,
    )


@router.get("/{user_id}/recipes", response_model=PaginatedRecipes)
async def get_user_recipes(
    user_id: UUID,
    user: CurrentUser = Depends(get_current_user),  # any authenticated user may view
    db: AsyncSession = Depends(get_db),
    limit: int = Query(default=20, ge=1, le=100),
    page: int = Query(default=1, ge=1),
) -> PaginatedRecipes:
    rows = await recipe_repository.list_public_by_user(
        db,
        user_id,
        current_user_id=UUID(user.id),
        limit=limit,
        offset=(page - 1) * limit,
    )
    total = await recipe_repository.count_public_by_user_id(db, user_id)
    return PaginatedRecipes(
        items=[RecipeResponse.from_row(row) for row in rows],
        total=total,
        page=page,
        limit=limit,
    )


# --- Follower Endpoints ---


@router.post("/{user_id}/follow", response_model=FollowActionResponse)
async def follow_user(
    user_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> FollowActionResponse:
    follower_id = UUID(current_user.id)
    if follower_id == user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot follow yourself.",
        )

    target_profile = await profile_service.get_by_id(db, user_id)
    if not target_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    await user_follow_repository.follow(db, follower_id, user_id)
    return FollowActionResponse(
        success=True, message=f"Now following {target_profile.display_name}"
    )


@router.delete("/{user_id}/follow", response_model=FollowActionResponse)
async def unfollow_user(
    user_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> FollowActionResponse:
    follower_id = UUID(current_user.id)
    unfollowed = await user_follow_repository.unfollow(db, follower_id, user_id)

    if not unfollowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are not following this user.",
        )

    return FollowActionResponse(success=True, message="Successfully unfollowed user")


@router.get("/{user_id}/followers", response_model=list[FollowUserSummary])
async def get_followers(
    user_id: UUID,
    _: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[FollowUserSummary]:
    return await user_follow_repository.get_followers(db, user_id)


@router.get("/{user_id}/following", response_model=list[FollowUserSummary])
async def get_following(
    user_id: UUID,
    _: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[FollowUserSummary]:
    return await user_follow_repository.get_following(db, user_id)


@router.get("/{user_id}/stats", response_model=FollowStatsResponse)
async def get_follow_stats(
    user_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> FollowStatsResponse:
    return await user_follow_repository.get_stats(db, UUID(current_user.id), user_id)
