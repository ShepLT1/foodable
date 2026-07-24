from uuid import UUID
from typing import Any

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.auth_user import AuthUser
from app.models.profile import Profile
from app.models.user_follow import UserFollow
from app.schemas.user_follow import FollowStatsResponse, FollowUserSummary


class UserFollowRepository:
    async def follow(
        self, db: AsyncSession, follower_id: UUID, following_id: UUID
    ) -> bool:
        if follower_id == following_id:
            return False

        existing = await db.execute(
            select(UserFollow).where(
                UserFollow.follower_id == follower_id,
                UserFollow.following_id == following_id,
            )
        )
        if existing.scalar_one_or_none():
            return True

        follow_obj = UserFollow(follower_id=follower_id, following_id=following_id)
        db.add(follow_obj)
        await db.commit()
        return True

    async def unfollow(
        self, db: AsyncSession, follower_id: UUID, following_id: UUID
    ) -> bool:
        stmt = delete(UserFollow).where(
            UserFollow.follower_id == follower_id,
            UserFollow.following_id == following_id,
        )
        result = await db.execute(stmt)
        await db.commit()
        return cast_rowcount(result) > 0

    async def get_followers(
        self, db: AsyncSession, target_id: UUID
    ) -> list[FollowUserSummary]:
        stmt = (
            select(Profile.id, Profile.display_name, AuthUser.created_at)
            .join(UserFollow, UserFollow.follower_id == Profile.id)
            .join(AuthUser, AuthUser.id == Profile.id)
            .where(UserFollow.following_id == target_id)
            .order_by(UserFollow.created_at.desc())
        )
        result = await db.execute(stmt)
        return [
            FollowUserSummary(
                id=row.id, display_name=row.display_name, created_at=row.created_at
            )
            for row in result.all()
        ]

    async def get_following(
        self, db: AsyncSession, target_id: UUID
    ) -> list[FollowUserSummary]:
        stmt = (
            select(Profile.id, Profile.display_name, AuthUser.created_at)
            .join(UserFollow, UserFollow.following_id == Profile.id)
            .join(AuthUser, AuthUser.id == Profile.id)
            .where(UserFollow.follower_id == target_id)
            .order_by(UserFollow.created_at.desc())
        )
        result = await db.execute(stmt)
        return [
            FollowUserSummary(
                id=row.id, display_name=row.display_name, created_at=row.created_at
            )
            for row in result.all()
        ]

    async def get_stats(
        self, db: AsyncSession, current_user_id: UUID, target_id: UUID
    ) -> FollowStatsResponse:
        followers_stmt = (
            select(func.count())
            .select_from(UserFollow)
            .where(UserFollow.following_id == target_id)
        )
        followers_count = (await db.execute(followers_stmt)).scalar() or 0

        following_stmt = (
            select(func.count())
            .select_from(UserFollow)
            .where(UserFollow.follower_id == target_id)
        )
        following_count = (await db.execute(following_stmt)).scalar() or 0

        is_following_stmt = select(UserFollow).where(
            UserFollow.follower_id == current_user_id,
            UserFollow.following_id == target_id,
        )
        is_following = (
            await db.execute(is_following_stmt)
        ).scalar_one_or_none() is not None

        return FollowStatsResponse(
            follower_count=followers_count,
            following_count=following_count,
            is_following=is_following,
        )


def cast_rowcount(result: Any) -> int:
    return getattr(result, "rowcount", 0)


user_follow_repository = UserFollowRepository()
