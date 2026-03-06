from fastapi import Depends, FastAPI
from sqlalchemy import text

from backend.app.db.session import engine
from backend.app.db.base import Base
from backend.app.db import models

from backend.app.core.dependencies import get_current_user
from backend.app.db.models.user import User

# Routers
from backend.app.api.auth import router as auth_router
from backend.app.api.problems import router as problems_router
from backend.app.api.testcase import router as testcases_router
from backend.app.api.submissions import router as submissions_router
from backend.app.api.run import router as run_router
from backend.app.api.profile import router as profile_router   # NEW
from backend.app.api.admin import router as admin_router       # NEW
from backend.app.api.ai import router as ai_router             # NEW

app = FastAPI(title="Online Coding Practice Platform")

# ADD THIS BLOCK RIGHT HERE
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


# ── Routes ──────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(run_router)
app.include_router(problems_router)
app.include_router(testcases_router)
app.include_router(submissions_router)
app.include_router(profile_router)   # NEW
app.include_router(admin_router)     # NEW
app.include_router(ai_router)        # NEW


# ── Utility endpoints ────────────────────────────────────
@app.get("/")
def root():
    return {"message": "Backend running successfully!"}


@app.get("/health/db")
def db_health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"database": "connected"}
    except Exception as e:
        return {"database": "error", "details": str(e)}


@app.get("/me")
def read_current_user(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "is_admin": current_user.is_admin
    }