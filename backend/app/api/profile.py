from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.dependencies import get_current_user, get_db
from backend.app.db.models.user import User
from backend.app.db.models.submission import Submission
from backend.app.schemas.profile import UserProfile, UserStats
from backend.app.schemas.submission import SubmissionOut

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/", response_model=UserProfile)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Get current user's profile info."""
    return current_user


@router.get("/stats", response_model=UserStats)
def get_my_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's submission statistics."""
    submissions = db.query(Submission).filter(
        Submission.user_id == current_user.id
    ).all()

    stats = {
        "total_submissions": len(submissions),
        "accepted": 0,
        "wrong_answer": 0,
        "time_limit_exceeded": 0,
        "runtime_error": 0,
        "problems_solved": 0,
    }

    solved_problems = set()

    for s in submissions:
        status = s.status.lower()
        if status == "accepted":
            stats["accepted"] += 1
            solved_problems.add(s.problem_id)
        elif status == "wrong_answer":
            stats["wrong_answer"] += 1
        elif status == "time_limit_exceeded":
            stats["time_limit_exceeded"] += 1
        elif status == "runtime_error":
            stats["runtime_error"] += 1

    stats["problems_solved"] = len(solved_problems)

    return stats


@router.get("/submissions", response_model=list[SubmissionOut])
def get_my_submissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all submissions made by the current user."""
    return db.query(Submission).filter(
        Submission.user_id == current_user.id
    ).order_by(Submission.submitted_at.desc()).all()