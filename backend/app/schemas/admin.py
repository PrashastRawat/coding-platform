from pydantic import BaseModel, ConfigDict
from datetime import datetime


class UserAdminView(BaseModel):
    id: int
    username: str
    email: str
    is_admin: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PlatformStats(BaseModel):
    total_users: int
    total_problems: int
    total_submissions: int
    accepted_submissions: int