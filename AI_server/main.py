from fastapi import FastAPI
from routers import chat
app = FastAPI()

app.include_router(chat.Routers)

@app.get("/")
async def root():
    return {
        "/chat/stream": "returns a streaming response for the chat question. POST request with JSON body containing 'user_id' and 'question'.",
        "/chat/": "returns a response for the chat question. POST request with JSON body containing 'user_id' and 'question'.",
        "/chat/reset": "resets the chat history for a given user_id. POST request with JSON body containing 'user_id'.",
        "/chat/history": "returns the chat history for a given user_id. GET request with query parameter containing 'user_id'.",
        "/chat/delete_store": "deletes the vector store. DELETE request.", 
        "/chat/update_store": "updates the vector store with new data. PUT request with JSON body containing updated data in array format.",
        "/chat/get_qa": "gets the current Q&A data from the JSON file. GET request.",
        "/chat/most_relevant": "gets the most relevant document for a given question. GET request with query parameters containing 'user_id' and 'question'."
        }