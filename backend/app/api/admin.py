from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.dependencies import get_current_user, get_db
from backend.app.db.models.user import User
from backend.app.db.models.problem import Problem
from backend.app.db.models.submission import Submission
from backend.app.schemas.admin import UserAdminView, PlatformStats
from backend.app.schemas.problem import ProblemOut

router = APIRouter(prefix="/admin", tags=["Admin"])


def require_admin(current_user: User = Depends(get_current_user)):
    """Dependency — blocks non-admin users."""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


@router.get("/stats", response_model=PlatformStats)
def get_platform_stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    """Overall platform statistics."""
    total_users = db.query(User).count()
    total_problems = db.query(Problem).count()
    total_submissions = db.query(Submission).count()
    accepted = db.query(Submission).filter(
        Submission.status == "accepted"
    ).count()

    return {
        "total_users": total_users,
        "total_problems": total_problems,
        "total_submissions": total_submissions,
        "accepted_submissions": accepted,
    }


@router.get("/users", response_model=list[UserAdminView])
def get_all_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    """List all registered users."""
    return db.query(User).order_by(User.created_at.desc()).all()


@router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(require_admin)
):
    """Delete a user by ID (cannot delete yourself)."""
    if user_id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()


@router.get("/problems", response_model=list[ProblemOut])
def get_all_problems_admin(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    """List all problems (admin view)."""
    return db.query(Problem).all()


@router.delete("/problems/{problem_id}", status_code=204)
def delete_problem(
    problem_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    """Delete a problem and its test cases."""
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    db.delete(problem)
    db.commit()