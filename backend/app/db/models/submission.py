from sqlalchemy import Column, Integer, Text, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.app.db.base_class import Base  # ✅ use base_class to avoid circular import


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)
    code = Column(Text, nullable=False)
    language = Column(String, nullable=False)
    status = Column(String, nullable=False)  # accepted, wrong_answer, etc.
    runtime = Column(String, nullable=True)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="submissions")
    problem = relationship("Problem")