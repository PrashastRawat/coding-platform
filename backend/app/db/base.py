from backend.app.db.base_class import Base

# Import all models here so Alembic / SQLAlchemy detects them
from backend.app.db.models.user import User
from backend.app.db.models.problem import Problem
from backend.app.db.models.testcase import TestCase
from backend.app.db.models.submission import Submission  # was missing!