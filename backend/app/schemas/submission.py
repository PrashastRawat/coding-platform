from pydantic import BaseModel, ConfigDict
from datetime import datetime


class SubmissionCreate(BaseModel):
    problem_id: int
    language: str
    code: str


class SubmissionOut(BaseModel):
    id: int
    user_id: int
    problem_id: int
    code: str
    language: str
    status: str
    runtime: str | None
    submitted_at: datetime

    model_config = ConfigDict(from_attributes=True)