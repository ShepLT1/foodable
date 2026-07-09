from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.profile import profile_repository


class ProfileService:
    async def get_by_id(
        self,
        db: AsyncSession,
        profile_id: UUID,
    ):
        return await profile_repository.get_by_id(db, profile_id)


profile_service = ProfileService()
