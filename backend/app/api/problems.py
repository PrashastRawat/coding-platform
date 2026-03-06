from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.db.session import SessionLocal
from backend.app.db.models.problem import Problem
from backend.app.schemas.problem import ProblemCreate, ProblemOut

router = APIRouter(prefix="/problems", tags=["problems"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ProblemOut)
def create_problem(problem: ProblemCreate, db: Session = Depends(get_db)):
    db_problem = Problem(**problem.model_dump())
    db.add(db_problem)
    db.commit()
    db.refresh(db_problem)
    return db_problem

@router.get("/", response_model=list[ProblemOut])
def get_problems(db: Session = Depends(get_db)):
    return db.query(Problem).all()

@router.get("/{problem_id}", response_model=ProblemOut)
def get_problem(problem_id: int, db: Session = Depends(get_db)):

    problem = db.query(Problem).filter(Problem.id == problem_id).first()

    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    return problem