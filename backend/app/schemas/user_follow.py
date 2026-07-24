from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class FollowUserSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    display_name: str
    created_at: datetime


class FollowStatsResponse(BaseModel):
    follower_count: int
    following_count: int
    is_following: bool = False


class FollowActionResponse(BaseModel):
    success: bool
    message: str
