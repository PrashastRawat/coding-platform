from pydantic import BaseModel
from datetime import datetime

class ProblemCreate(BaseModel):
    title: str
    description: str
    difficulty: str


class ProblemOut(BaseModel):
    id: int
    title: str
    description: str
    difficulty: str
    created_by: int | None
    created_at: datetime

    class Config:
        from_attributes = True