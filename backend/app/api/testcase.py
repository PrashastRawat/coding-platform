from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.db.models.testcase import TestCase
from backend.app.schemas.testcase import TestCaseCreate, TestCaseResponse


router = APIRouter(prefix="/testcases", tags=["TestCases"])


@router.post("/{problem_id}", response_model=TestCaseResponse)
def create_testcase(problem_id: int, testcase: TestCaseCreate, db: Session = Depends(get_db)):

    db_testcase = TestCase(
        problem_id=problem_id,
        input_data=testcase.input_data,
        expected_output=testcase.expected_output,
        is_hidden=testcase.is_hidden
    )

    db.add(db_testcase)
    db.commit()
    db.refresh(db_testcase)

    return db_testcase


@router.get("/problem/{problem_id}")
def get_problem_testcases(problem_id: int, db: Session = Depends(get_db)):

    testcases = db.query(TestCase).filter(TestCase.problem_id == problem_id).all()

    return testcases
