from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pinecone import Pinecone
from pymilvus import connections, utility
from langchain_milvus import Milvus
import json

class VectorStore:
    def __init__(self, embedding_model,api_key='', name='pinecone', index_name='default_index'):
        self.index_name = index_name
        self.api_key = api_key
        self.embedding_model = embedding_model
        self.name = name
        self.connect()

    def connect(self):
        if self.name == 'pinecone':
            self.pc = Pinecone(api_key=self.api_key)
        elif self.name == 'milvus':
            connections.connect(uri='http://localhost:19530')

    def get_vector_store(self):
        if self.name == 'pinecone':
            return PineconeVectorStore(index_name=self.index_name, embedding=self.embedding_model)
        elif self.name == 'milvus':
            if utility.has_collection(collection_name=self.index_name):
                return Milvus(
                    embedding_function=self.embedding_model,
                    collection_name=self.index_name,
                    connection_args={'uri':'http://localhost:19530'}
                )
            else:
                return self.create_vector_store(self.embedding_model)
        
    def create_vector_store(self,embeddings):
        texts = self.prepare_texts()
        if self.name == 'pinecone':
            exit_indexes = [index['name'] for index in self.pc.list_indexes()]
            if self.index_name in exit_indexes:
                index = self.pc.Index(self.index_name)
                index_stats = index.describe_index_stats()
                if index_stats['total_vector_count'] > 0:
                    return PineconeVectorStore(index_name=self.index_name, embedding=embeddings)
                
            return PineconeVectorStore.from_texts(
                texts=texts,
                embedding=embeddings,
                index_name=self.index_name
            )
        elif self.name == 'milvus':
            if utility.has_collection(collection_name=self.index_name):
                utility.drop_collection(collection_name=self.index_name)
                return Milvus.from_texts(
                    texts=texts,
                    embedding=self.embedding_model,
                    collection_name=self.index_name,
                    connection_args={'uri':'http://localhost:19530'},
                )
            else:
                return Milvus.from_texts(
                    texts=texts,
                    embedding=self.embedding_model,
                    collection_name=self.index_name,
                    connection_args={'uri':'http://localhost:19530'},
                )
    
    def delete_vector_store(self):
        if self.name == 'pinecone':
            self.pc.delete_index(self.index_name)
        elif self.name == 'milvus':
            if utility.has_collection(collection_name=self.index_name):
                utility.drop_collection(collection_name=self.index_name)
    
    def update_vector_store(self):
        self.delete_vector_store()
        self.create_vector_store(self.embedding_model)
    
    def prepare_texts(self):
        chunks = []
        with open('./background_docs/QA_list.json','r',encoding='utf-8') as f:
            content = json.load(f)
        for item in content:
            chunks.append(f'category: {item["category"]}\nquestion: {item["question"]}\nanswer: {item["answer"]}\n')

        return chunks

