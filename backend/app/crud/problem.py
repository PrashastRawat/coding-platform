from sqlalchemy.orm import Session
from backend.app.db.models.problem import Problem
from backend.app.schemas.problem import ProblemCreate


def get_problem(db: Session, problem_id: int):
    return db.query(Problem).filter(Problem.id == problem_id).first()


def get_problems(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Problem).offset(skip).limit(limit).all()


def create_problem(db: Session, problem: ProblemCreate, user_id: int):
    db_problem = Problem(**problem.model_dump(), created_by=user_id)
    db.add(db_problem)
    db.commit()
    db.refresh(db_problem)
    return db_problem


def delete_problem(db: Session, problem_id: int):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if problem:
        db.delete(problem)
        db.commit()
    return problem