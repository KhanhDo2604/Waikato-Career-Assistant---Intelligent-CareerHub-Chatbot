from fastapi import APIRouter,Request
from models.request import RequestModel
from services.vector_store import Vector_store
from services.model import Model
from services.chat import Chat
import json

# routers = APIRouter(prefix="/chat", tags=["chat"])
# embedding_model = Model(model_name="nomic-embed-text").embedding_model
# vectore_store = Vector_store(embedding_model=embedding_model, index_name="qa_list")
# session_chats = {}
# with open('./background_docs/QA_list.json','r',encoding='utf-8') as f:
#     content = json.load(f)

# @routers.post("/ask")
# async def ask_question(request: RequestModel):
#     """
#     ask a question and get an answer based on the qa_list.
    
#     :param requestModel: user_id and question
#     :return str: standard answer based on the qa_list
#     """
#     user_id = request.user_id
#     question = request.question
#     if user_id not in session_chats:
#         session_chats[user_id] = Chat(user_id=user_id)
#     chat_instance = session_chats[user_id]
    
#     if vectore_store.vector_store_exists():
#         vectore_store_instance = vectore_store.get_vector_store()
#     else:
#         vectore_store_instance = vectore_store.create_vector_store([item.get("question") for item in content])
    
#     result = vectore_store_instance.similarity_search_with_score(question, k=1)

#     if result[0][1] < 0.4:
#         answer = next((item['answer'] for item in content if item['question'] == result[0][0].page_content), None)
#     else:
#         answer = "I am sorry, I don't have the answer to that question. Please try another one or turn to human support."
    
#     chat_instance.append_message(question, answer)
#     return answer

# @routers.get("/most_relevant")
# async def get_most_relevant(question: str):
#     """
#     ask a question and return the most relevant question from the qa_list along with similarity score.
    
#     :param str: question string from user
#     :return dict: most relevant question and similarity score
#     """
#     if vectore_store.vector_store_exists():
#         vectore_store_instance = vectore_store.get_vector_store()
#     else:
#         vectore_store_instance = vectore_store.create_vector_store([item.get("question") for item in content])
#     result = vectore_store_instance.similarity_search_with_score(question, k=1)
#     return {
#         "most_relevant_question": result[0][0].page_content,
#         "similarity_score": result[0][1]
#     }

# @routers.get("/history")
# async def get_chat_history(user_id: str):
#     """
#     retrieve chat history for a given user_id.
    
#     :param user_id: user's unique identifier
#     :return dict: user's chat history or message if no history found
#     """
#     if user_id in session_chats:
#         chat_instance = session_chats[user_id]
#         return chat_instance.get_history()
#     else:
#         return {"message": "No chat history found for this user."}
    
# @routers.get('/reset')
# async def reset_chat_history(user_id: str):
#     """
#     reset chat history for a given user_id.

#     :param user_id: user's unique identifier
#     :return dict: chat history before reset or message if no history found
#     """
#     if user_id in session_chats:
#         chat_history = session_chats[user_id].get_history()
#         del session_chats[user_id]
#         return chat_history
#     else:
#         return {"message": "No chat history found for this user."}
    
# @routers.get('/get_qa')
# async def get_qa_list():
#     """
#     retrieve the entire QA list from the qa_list

#     :return dict: the entire QA list
#     """
#     with open('./background_docs/QA_list.json','r',encoding='utf-8') as f:
#             content = json.load(f)
#     return content

# @routers.put('/update_qa')
# async def update_qa_list(req:Request):
#     """
#     update the entire QA list with a new one.
    
#     :param Request: the new QA list in JSON format
#     :return dict: success message
#     """
#     new_qa = await req.json()
#     with open('./background_docs/QA_list.json','w',encoding='utf-8') as f:
#             json.dump(new_qa, f, ensure_ascii=False, indent=4)
#     vectore_store.update_vector_store([item.get("question") for item in new_qa])
#     return {"message": "QA list updated successfully."}

# @routers.delete('/delete_vector_store')
# async def delete_vector_store():
#     """
#     delete the entire vector store.

#     :return dict: success message
#     """
#     vectore_store.delete_vector_store()
#     return {"message": "Vector store deleted successfully."}