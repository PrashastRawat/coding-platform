from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from backend.app.core.dependencies import get_current_user, get_db
from backend.app.db.models.user import User
from backend.app.db.models.problem import Problem
from backend.app.db.models.submission import Submission
from backend.app.services.ai_hint import get_hint, get_code_feedback, explain_error

router = APIRouter(prefix="/ai", tags=["AI"])


class HintRequest(BaseModel):
    problem_id: int
    code: str


class FeedbackRequest(BaseModel):
    submission_id: int


class ErrorExplainRequest(BaseModel):
    code: str
    error_message: str


class AIResponse(BaseModel):
    response: str


@router.post("/hint", response_model=AIResponse)
def request_hint(
    body: HintRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a non-spoiler hint for a problem based on current code."""
    problem = db.query(Problem).filter(Problem.id == body.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    hint = get_hint(problem.description, body.code)
    return {"response": hint}


@router.post("/feedback", response_model=AIResponse)
def request_feedback(
    body: FeedbackRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get AI code review feedback on a past submission."""
    submission = db.query(Submission).filter(
        Submission.id == body.submission_id,
        Submission.user_id == current_user.id
    ).first()

    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    problem = db.query(Problem).filter(Problem.id == submission.problem_id).first()

    feedback = get_code_feedback(problem.description, submission.code, submission.status)
    return {"response": feedback}


@router.post("/explain-error", response_model=AIResponse)
def explain_code_error(
    body: ErrorExplainRequest,
    current_user: User = Depends(get_current_user)
):
    """Explain a runtime error or wrong output in plain English."""
    explanation = explain_error(body.code, body.error_message)
    return {"response": explanation}