from fastapi import APIRouter,Request
from services.model import Model
from sklearn.metrics.pairwise import cosine_similarity
from models.request import CategoryRequestModel
import json

routers = APIRouter(prefix="/category", tags=["category"])
embedding_model = Model(model_name="mxbai-embed-large").embedding_model
with open('routers/categories.json','r',encoding='utf-8') as f:
    categories = json.load(f)
with open('routers/questions.json','r',encoding='utf-8') as f:
    questions = json.load(f)
THRESHOLD = 0.53 

@routers.get("/group")
async def group():
    """
    return the question list's all categories.
    
    :return list: question's categories
    """

    categories_embedding = embedding_model.embed_documents(categories)
    question_embedding = embedding_model.embed_documents(questions)
    if len(question_embedding) == 0 or len(categories_embedding) == 0:
        return {"error": "No embeddings found."}
    sim = cosine_similarity(question_embedding, categories_embedding)
    results = []
    for i, question in enumerate(questions):
        max_index = sim[i].argmax()
        max_value = sim[i][max_index]
        if max_value >= THRESHOLD:
            results.append(categories[max_index])
        else:
            results.append("unknown")

    return results

@routers.get("/group_one")
async def group_one(question: str):
    """
    return the category for a given question.
    
    :param question: user question
    :return str: category of the question
    """
    categories_embedding = embedding_model.embed_documents(categories)
    question_embedding = embedding_model.embed_documents([question])
    if len(question_embedding) == 0 or len(categories_embedding) == 0:
        return {"error": "No embeddings found."}
    sim = cosine_similarity(question_embedding, categories_embedding)
    #TODO compare the similarity value with theshold. 
    # If the value more than theshold return the corresponding category
    # else return "unknown"

    return None # replace this command with your logic

@routers.post("/questions_belong_to")
async def questions_belong_to(req: CategoryRequestModel):
    """
    return the list of questions that belong to a given category.
    
    :param category: category name
    :return list: questions that belong to the category
    """
    category = req.category
    questions = req.questions
    categories_embedding = embedding_model.embed_documents([category])
    question_embedding = embedding_model.embed_documents(questions)
    if len(question_embedding) == 0 or len(categories_embedding) == 0:
        return {"error": "No embeddings found."}
    sim = cosine_similarity(question_embedding, categories_embedding)
    results = []
    for i, score in enumerate(sim):
        if score[0] >= THRESHOLD:
            results.append(questions[i])
    return results

@routers.get("/cat_all_count")
async def cat_all_count():
    """
    return the count of all categories.
    
    :return dict: count of all categories
    """
    count_dict = {}
    categories_embedding = embedding_model.embed_documents(categories)
    question_embedding = embedding_model.embed_documents(questions)
    if len(question_embedding) == 0 or len(categories_embedding) == 0:
        return {"error": "No embeddings found."}
    sim = cosine_similarity(question_embedding, categories_embedding)
    for i, question in enumerate(questions):
        max_index = sim[i].argmax()
        max_value = sim[i][max_index]
        if max_value >= THRESHOLD:
            category = categories[max_index]
        else:
            category = "unknown"
        if category in count_dict:
            count_dict[category] += 1
        else:
            count_dict[category] = 1
    return count_dict

@routers.get("/cat_count")
async def cat_count(category: str):
    """
    return the count of category.
    
    :return int: count of all category
    """
    categories_embedding = embedding_model.embed_documents([category])
    question_embedding = embedding_model.embed_documents(questions)
    if len(question_embedding) == 0 or len(categories_embedding) == 0:
        return {"error": "No embeddings found."}
    sim = cosine_similarity(question_embedding, categories_embedding)
    count = 0
    #TODO loop the similarity array and compare the similarity value with theshold. 
    # If the value more than theshold increase the count by 1

    return count

@routers.post("/update")
async def update(req: CategoryRequestModel):
    """
    update the categories list with a new categories list.
    
    :param categories: new categories list
    :return str: success message
    """
    new_category = req.category
    if new_category and new_category not in categories:
        categories.append(new_category)
        with open('routers/categories.json','w',encoding='utf-8') as f:
            json.dump(categories,f,ensure_ascii=False,indent=4)
        return {"message": "Categories updated successfully."}
    else:
        return {"message": "Category already exists or invalid."}

@routers.get("/list")
async def list_categories():
    """
    return the list of all categories.
    
    :return list: all categories
    """
    return categories