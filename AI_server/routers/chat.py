import re
from fastapi import APIRouter,Request
from models.request import RequestModel
from services.vector_store import Vector_store
from services.model import Model
from services.chat import Chat
import json
from typing import Dict

routers = APIRouter(prefix="/chat", tags=["chat"])
embedding_model = Model(model_name="nomic-embed-text").embedding_model
vectore_store = Vector_store(embedding_model=embedding_model, index_name="qa_list")
session_chats = {}

QUESTION_MAP: Dict[str, dict] = {}

def normalize(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text

def rebuild_vector_store():
    """
    Rebuild vector store & question map from QA_list.json
    MUST be called after any dataset change
    """
    global QUESTION_MAP

    with open("./background_docs/QA_list.json", "r", encoding="utf-8") as f:
        content = json.load(f)

    documents = []
    question_map = {}

    for item in content:
        category = item["category"]
        answer = item["answer"]

        for q in item.get("questions", []):
            q_norm = normalize(q)
            documents.append(q_norm)
            question_map[q_norm] = {
                "category": category,
                "answer": answer,
            }

    if vectore_store.vector_store_exists():
        vectore_store.delete_vector_store()

    vectore_store.create_vector_store(documents)

    QUESTION_MAP = question_map


@routers.post("/ask")
async def ask_question(request: RequestModel):
    """
    ask a question and get an answer based on the qa_list.
    
    :param requestModel: user_id and question
    :return str: standard answer based on the qa_list
    """
    question = normalize(request.question)

    if not vectore_store.vector_store_exists():
        rebuild_vector_store()

    vectore_store_instance = vectore_store.get_vector_store()

    results = vectore_store_instance.similarity_search_with_score(
        question,
        k=3
    )

    if not results:
        return {"category": "", "answer": ""}

    best_doc, best_score = min(results, key=lambda x: x[1])

    threshold = 0.4 if len(question.split()) < 6 else 0.45

    print(f"[DEBUG] Best score: {best_score} | Threshold: {threshold}")

    if best_score >= threshold:
        return {"category": "", "answer": ""}

    matched_question = best_doc.page_content
    matched = QUESTION_MAP.get(matched_question)

    if not matched:
        return {"category": "", "answer": ""}

    return {
        "category": matched["category"],
        "answer": matched["answer"],
    }

@routers.get("/most_relevant")
async def get_most_relevant(question: str):
    """
    ask a question and return the most relevant question from the qa_list along with similarity score.
    
    :param str: question string from user
    :return dict: most relevant question and similarity score
    """
    with open('./background_docs/QA_list.json','r',encoding='utf-8') as f:
        content = json.load(f)

    if vectore_store.vector_store_exists():
        vectore_store_instance = vectore_store.get_vector_store()
    else:
        vectore_store_instance = vectore_store.create_vector_store([item.get("question") for item in content])
    result = vectore_store_instance.similarity_search_with_score(question, k=1)
    return {
        "most_relevant_question": result[0][0].page_content,
        "similarity_score": result[0][1]
    }

@routers.get("/history")
async def get_chat_history(user_id: str):
    """
    retrieve chat history for a given user_id.
    
    :param user_id: user's unique identifier
    :return dict: user's chat history or message if no history found
    """
    if user_id in session_chats:
        chat_instance = session_chats[user_id]
        return chat_instance.get_history()
    else:
        return {"message": "No chat history found for this user."}
    
@routers.get('/index')
async def check_index():
    """
    return the latest index of dataset and plus one.
    because this index will be used for add feature. So the index of new qa item
    is latest index of dataset plus one.
    """
    with open('./background_docs/QA_list.json','r',encoding='utf-8') as f:
        content = json.load(f)
    return len(content)+1   

@routers.get('/reset')
async def reset_chat_history(user_id: str):
    """
    reset chat history for a given user_id.

    :param user_id: user's unique identifier
    :return dict: chat history before reset or message if no history found
    """
    if user_id in session_chats:
        chat_history = session_chats[user_id].get_history()
        del session_chats[user_id]
        return chat_history
    else:
        return {"message": "No chat history found for this user."}
    
@routers.get('/get_all_qa')
async def get_qa_list():
    """
    retrieve the entire QA list from the qa_list

    :return dict: the entire QA list
    """
    with open('./background_docs/QA_list.json','r',encoding='utf-8') as f:
            content = json.load(f)
    return content

@routers.get('/get_one_qa')
async def get_one_qa(req:Request):
    """
    retrieve the specfic qa item from the qa_list via item's id

    :return dict: the specific qa item. else return fail message 
    """
    query = await req.json()
    qa_id = query["id"]
    with open('./background_docs/QA_list.json','r',encoding='utf-8') as f:
        for item in json.load(f):
            if item["id"] == qa_id:
                return item
    return {"message":"Not find the qa item"}

@routers.put('/update_qa')
async def update_qa_list(req:Request):
    """
    update the single with a new one.
    
    :param Request: the new QA item in JSON format
    :return dict: success message
    """
    new_qa = await req.json()
    
    with open('./background_docs/QA_list.json','r',encoding='utf-8') as f:
        content = json.load(f)

    if new_qa["id"] not in {qa["id"] for qa in content}:
        return {"message":"the update index not in dataset"}
    
    for qa in content:
        if qa["id"] == new_qa["id"]:
            qa["category"] = new_qa["category"]
            qa["questions"] = new_qa["questions"]
            qa["answer"] = new_qa["answer"]
            qa["common"] = new_qa["common"]

    with open('./background_docs/QA_list.json','w',encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=4)

    rebuild_vector_store()
    return {"message": "Updated successfully.", "new_question": new_qa}



@routers.post('/add')
async def add_new_qa(req:Request):
    """
    add a new qa item to dataset
    
    :param req: a new qa item in JSON format
    :return dic: success message 
    """
    new_qa = await req.json()

    with open('./background_docs/QA_list.json','r',encoding='utf-8') as f:
        content = json.load(f)

    if new_qa["id"] != len(content) + 1:
        return {"message": "index error"}
    
    content.append(new_qa)
    with open('./background_docs/QA_list.json','w',encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=4)

    rebuild_vector_store()
    return {"message": "Add new item successfully.", "new_question": new_qa}

@routers.delete('/del')
async def del_qa(req:Request):
    """
    delete a qa item from dataset
    
    :param req: the qa item want to be deleted
    :return dic: success message
    """
    del_qa = await req.json()
    with open('./background_docs/QA_list.json','r',encoding='utf-8') as f:
        content = json.load(f)
    if del_qa["id"] not in {qa["id"] for qa in content}:
        return {"message":"the update index not in dataset"}
    drop_id = del_qa["id"]
    content = [item for item in content if item["id"] != drop_id]
    for new_id, item in enumerate(content, start=1):
        item['id'] = new_id
    with open('./background_docs/QA_list.json','w',encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=4)
    vectore_store.update_vector_store([item.get("question") for item in content])
    return {"message": "Delete item successfully."}

@routers.delete('/delete_vector_store')
async def delete_vector_store():
    """
    delete the entire vector store.

    :return dict: success message
    """
    vectore_store.delete_vector_store()
    return {"message": "Vector store deleted successfully."}