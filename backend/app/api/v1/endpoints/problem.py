from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.schemas.problem import ProblemCreate, ProblemOut
from backend.app.crud.problem import create_problem, get_problem

router = APIRouter()

@router.post("/", response_model=ProblemOut)
def create(problem: ProblemCreate, db: Session = Depends(get_db)):
    return create_problem(db, problem, user_id=1)

@router.get("/", response_model=list[ProblemOut])
def read_problems(db: Session = Depends(get_db)):
    return get_problem(db)