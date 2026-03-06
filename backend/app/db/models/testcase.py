from sqlalchemy import Column, Integer, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.base_class import Base

class TestCase(Base):
    __tablename__ = "testcases"

    id = Column(Integer, primary_key=True, index=True)
    problem_id = Column(Integer, ForeignKey("problems.id"), nullable=False)

    input_data = Column(Text, nullable=False)
    expected_output = Column(Text, nullable=False)

    is_hidden = Column(Boolean, default=False)

    problem = relationship("Problem", back_populates="testcases")