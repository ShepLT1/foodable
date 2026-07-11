from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.profile import Profile
from app.repositories.profile import profile_repository
from app.schemas import ProfileUpdate


class ProfileService:
    async def get_by_id(
        self,
        db: AsyncSession,
        profile_id: UUID,
    ) -> Profile | None:
        return await profile_repository.get_by_id(db, profile_id)

    async def update(
        self,
        db: AsyncSession,
        profile_id: UUID,
        data: ProfileUpdate,
    ) -> Profile | None:
        # only write fields the client actually sent
        changes = data.model_dump(exclude_unset=True)

        if not changes:
            return await profile_repository.get_by_id(db, profile_id)

        return await profile_repository.update(db, profile_id, changes)


profile_service = ProfileService()
