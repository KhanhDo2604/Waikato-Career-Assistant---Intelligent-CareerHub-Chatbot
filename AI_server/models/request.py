from pydantic import BaseModel

class RequestModel(BaseModel):
    user_id: str | None = None
    question: str | None = None
    