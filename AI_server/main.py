from fastapi import FastAPI
from routers import chat

app = FastAPI()

app.include_router(chat.routers)

@app.get("/")
async def root():
    return {
        "/chat/ask": "return the answer response for user question. POST request with JSON body containing 'user_id' and 'question'",
        "/chat/most_relevant": "return the most relevant question from the qa_list along with similarity score. GET request with 'question' query parameter",
        "/chat/history": "retrieve chat history for a given user_id.GET request with 'user_id' query parameter",
        "/chat/reset": "reset chat history for a given user_id. GET request with 'user_id' query parameter",
        "/chat/get_qa": "retrieve the entire QA list from the qa_list. GET request",
        "/chat/update_qa": "update the QA list with a new QA list. PUT request with JSON body containing the new QA list",
        "/chat/delete_qa": "delete the existing QA list. DELETE request"
        }