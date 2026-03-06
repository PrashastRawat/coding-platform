from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.core.dependencies import get_current_user
from backend.app.db.models.user import User
from backend.app.db.session import get_db

from backend.app.db.models.submission import Submission
from backend.app.db.models.testcase import TestCase

from backend.app.schemas.submission import SubmissionCreate, SubmissionOut

from backend.app.services.judge import judge_submission

router = APIRouter(prefix="/submissions", tags=["Submissions"])


@router.post("/", response_model=SubmissionOut)
def create_submission(
    submission: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # 1️⃣ create submission
    db_submission = Submission(
        user_id=current_user.id,
        problem_id=submission.problem_id,
        code=submission.code,
        language=submission.language,
        status="pending"
    )

    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)

    # 2️⃣ fetch testcases
    testcases = db.query(TestCase).filter(
        TestCase.problem_id == submission.problem_id
    ).all()

    # 3️⃣ run judge
    status, runtime = judge_submission(submission.code, testcases)

    # 4️⃣ update submission
    db_submission.status = status
    db_submission.runtime = str(runtime)

    db.commit()
    db.refresh(db_submission)

    return db_submission


@router.get("/", response_model=list[SubmissionOut])
def get_submissions(db: Session = Depends(get_db)):
    return db.query(Submission).all()