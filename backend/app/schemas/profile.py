from pydantic import BaseModel, ConfigDict
from datetime import datetime


class UserProfile(BaseModel):
    id: int
    username: str
    email: str
    is_admin: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserStats(BaseModel):
    total_submissions: int
    accepted: int
    wrong_answer: int
    time_limit_exceeded: int
    runtime_error: int
    problems_solved: int