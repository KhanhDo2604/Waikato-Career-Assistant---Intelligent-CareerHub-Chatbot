from pymilvus import connections,utility
from langchain_milvus import Milvus

connections.connect(uri="http://localhost:19530")

class Vector_store:
    def __init__(self,embedding_model,index_name):
        self.embedding_model = embedding_model
        self.index_name = index_name
    
    def vector_store_exists(self):
        return utility.has_collection(self.index_name)
    
    def create_vector_store(self,document):
        return Milvus.from_texts(
            texts=document,
            embedding=self.embedding_model,
            collection_name=self.index_name
        )
    def get_vector_store(self):
        return Milvus(
            embedding_function=self.embedding_model,
            collection_name=self.index_name
        )
    def delete_vector_store(self):
        if utility.has_collection(collection_name=self.index_name):
            utility.drop_collection(collection_name=self.index_name)
        print(f"Collection {self.index_name} deleted")
    
    def update_vector_store(self,new_document):
        self.delete_vector_store()
        self.create_vector_store(new_document)
        print(f"Collection {self.index_name} updated with new document")
