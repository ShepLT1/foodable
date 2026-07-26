from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.auth_user import AuthUser
from app.models.profile import Profile


class ProfileRepository:
    async def get_by_id(
        self,
        db: AsyncSession,
        profile_id: UUID,
    ) -> Profile | None:
        result = await db.execute(select(Profile).where(Profile.id == profile_id))

        return result.scalar_one_or_none()

    # the auth.users row — holds signup time (created_at) that profiles doesn't copy
    async def get_auth_user(
        self,
        db: AsyncSession,
        user_id: UUID,
    ) -> AuthUser | None:
        result = await db.execute(select(AuthUser).where(AuthUser.id == user_id))

        return result.scalar_one_or_none()

    async def update(
        self,
        db: AsyncSession,
        profile_id: UUID,
        changes: dict,
    ) -> Profile | None:
        profile = await self.get_by_id(db, profile_id)

        if profile is None:
            return None

        for field, value in changes.items():
            setattr(profile, field, value)

        # first profile write marks onboarding complete; later writes leave it
        if profile.onboarded_at is None:
            profile.onboarded_at = func.now()

        await db.commit()
        await db.refresh(profile)

        return profile


profile_repository = ProfileRepository()
