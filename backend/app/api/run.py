from fastapi import APIRouter
from backend.app.schemas.run import RunCodeRequest, RunCodeResponse
from backend.app.services.run_code import run_code

router = APIRouter(prefix="/run", tags=["Run Code"])


@router.post("/", response_model=RunCodeResponse)
def run_user_code(request: RunCodeRequest):

    result = run_code(request.code, request.input_data)

    return result