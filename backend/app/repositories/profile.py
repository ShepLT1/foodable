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


profile_repository = ProfileRepository()
