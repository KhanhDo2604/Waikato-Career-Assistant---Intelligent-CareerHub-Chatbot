from fastapi import FastAPI
from routers import chat
app = FastAPI()

app.include_router(chat.Routers)

@app.get("/")
async def root():
    return {"message": "Welcome to the RAG Chat API"}