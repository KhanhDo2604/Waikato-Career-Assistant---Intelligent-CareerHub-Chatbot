from pydantic import BaseModel

class RequestModel(BaseModel):
    user_id: str | None = None
    question: str | None = None

class CategoryRequestModel(BaseModel):
    category: str | None = None
    questions: list[str] | None = None
    