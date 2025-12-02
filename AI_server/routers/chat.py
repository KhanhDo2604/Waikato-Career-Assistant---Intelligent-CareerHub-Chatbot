from fastapi import APIRouter, Request,Depends
from fastapi.responses import StreamingResponse
from services.chain import user_session, ChatChain
from services.model import Model
from services.vector_store import VectorStore
from models.request import ChatRequest
import json
Routers = APIRouter(prefix="/chat", tags=["chat"])

chat_model = Model(model_name='llama3').chat_model(company='ollama')
embedding_model = Model(model_name='nomic-embed-text').embedding_model(company='ollama')
vector_store = VectorStore(embedding_model=embedding_model, name='milvus', index_name='job_collection')
template = """
You are a helpful assistant.Your main job is to act as a customer service, 
helping users resolve issues they encounter on career platforms.
I will provide some common questions and answers for reference. 
Don't take them as user's chat history. They just reference.
Use the conversation history and common questions and answers to answer the user's latest question.
If you find the provided common questions and answers are unrelated to user's question and you don't know how to answer, just say "I don't know".
--Conversation history:{chat_history}
--Common questions: {context}
--User's question: {question}
"""

@Routers.post("/stream")
async def chat_stream(req: ChatRequest):
    user_id = req.user_id
    question = req.question
    if user_id not in user_session:
        user_session[user_id] = ChatChain(
            vector_store=vector_store.get_vector_store(),
            model=chat_model,
            template=template,
            multi_turn=True
        )
    chain = user_session[user_id]
    answer = await chain.ask_question_stream(question)
    return StreamingResponse(answer,media_type='text/plain')

@Routers.post('/')
async def chat(req: ChatRequest):
    user_id = req.user_id
    question = req.question
    if user_id not in user_session:
        user_session[user_id] = ChatChain(
            vector_store=vector_store.get_vector_store(),
            model=chat_model,
            template=template,
            multi_turn=True
        )
    chain = user_session[user_id]
    return await chain.ask_question(question)

@Routers.post('/reset')
async def reset_chat(req: ChatRequest):
    user_id = req.user_id
    if user_id in user_session:
        chat_history = user_session[user_id].chat_history
        del user_session[user_id]
        print(f"Chat history for user {user_id} has been reset.")
        return chat_history
    else:
        return None

@Routers.get('/history')
async def get_history(req: Request):
    user_id = (await req.json()).get("user_id")
    if user_id in user_session:
        chain = user_session[user_id]
        return {"chat_history": chain.chat_history}
    else:
        return None
    
@Routers.delete('/delete_store')
async def delete_vector_store():
    vector_store.delete_vector_store()
    return {"message": "Vector store deleted successfully."}

@Routers.put('/update_store')
async def update_vector_store(req:Request):
    content = await req.json()
    with open('./background_docs/QA_list.json','w',encoding='utf-8') as f:
        json.dump(content,f,ensure_ascii=False,indent=4)
    vector_store.update_vector_store()
    return {"message": "Vector store updated successfully."}

@Routers.get('/get_qa')
async def get_qa_file():
    with open('./background_docs/QA_list.json','r',encoding='utf-8') as f:
        content = json.load(f)
    return content

@Routers.get("/most_relevant")
async def get_relevant(req: ChatRequest):
    user_id = req.user_id
    question = req.question
    if user_id not in user_session:
        return {"error": "Session not found"}
    
    chat_chain = user_session[user_id]
    result = await chat_chain.get_most_relevant_document(question)
    return result