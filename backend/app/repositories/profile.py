from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profile import Profile


class ProfileRepository:
    async def get_by_id(
        self,
        db: AsyncSession,
        profile_id: UUID,
    ) -> Profile | None:
        result = await db.execute(select(Profile).where(Profile.id == profile_id))

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

        await db.commit()
        await db.refresh(profile)

        return profile


profile_repository = ProfileRepository()
