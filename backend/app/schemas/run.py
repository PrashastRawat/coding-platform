from pydantic import BaseModel


class RunCodeRequest(BaseModel):
    code: str
    input_data: str


class RunCodeResponse(BaseModel):
    output: str
    error: str
    runtime: float | None