from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
from backend.app.db.base_class import Base
from sqlalchemy.orm import relationship
import enum


class DifficultyLevel(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class Problem(Base):
    __tablename__ = "problems"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(Text)
    difficulty = Column(Enum(DifficultyLevel))
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    testcases = relationship("TestCase", back_populates="problem")