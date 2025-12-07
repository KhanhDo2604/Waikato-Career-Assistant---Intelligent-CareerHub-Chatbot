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
vector_store = VectorStore(embedding_model=embedding_model, name='milvus', index_name='QA_collection')
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
    """
    returns a streaming response for the chat question.
    
    :param req: Request object containing user_id and question in JSON body
    :return: StreamingResponse
    """
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
    """
    returns a response for the chat question.
    
    :param req: Request object containing user_id and question in JSON body
    :return: string answer
    """
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
    """
    resets the chat history for a given user_id.
    
    :param req: Request object containing user_id in JSON body
    :return: chat history if reset, else None
    """
    user_id = req.user_id
    if user_id in user_session:
        chat_history = user_session[user_id].chat_history
        del user_session[user_id]
        print(f"Chat history for user {user_id} has been reset.")
        return chat_history
    else:
        return None

@Routers.get('/history')
async def get_history(user_id: int):
    """
    returns the chat history for a given user_id.
    
    :param user_id: query parameter containing 'user_id'
    :return: chat history if found, else None
    """
    if str(user_id) in user_session:
        chain = user_session[str(user_id)]
        return {"chat_history": chain.chat_history}
    else:
        return None
    
@Routers.delete('/delete_store')
async def delete_vector_store():
    """
    deletes the vector store.
    
    :return: success message
    """
    vector_store.delete_vector_store()
    return {"message": "Vector store deleted successfully."}

@Routers.put('/update_store')
async def update_vector_store(req:Request):
    """
    updates the vector store with new data.
    
    :param req: Request object containing updated data in array format
    the data need meet the format.(e.g. [{"id":"1","category":"general","question":"...","answer":"..."},...])
    you can use /get_qa to get the current data format.
    :return: success message
    """
    content = await req.json()
    with open('./background_docs/QA_list.json','w',encoding='utf-8') as f:
        json.dump(content,f,ensure_ascii=False,indent=4)
    vector_store.update_vector_store()
    return {"message": "Vector store updated successfully."}

@Routers.get('/get_qa')
async def get_qa_file():
    """
    gets the current Q&A data from the JSON file.
    :return: content of the JSON file
    """
    with open('./background_docs/QA_list.json','r',encoding='utf-8') as f:
        content = json.load(f)
    return content

@Routers.get("/most_relevant")
async def get_relevant(user_id: int, question: str):
    """
    gets the most relevant document for a given question.
    
    :param user_id & question: query parameters containing user_id and question
    :return: most relevant document
    """
    if str(user_id) not in user_session:
        return {"error": "Session not found"}
    
    chat_chain = user_session[str(user_id)]
    result = await chat_chain.get_most_relevant_document(question)
    return result