from langchain_openai.chat_models import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from langchain_ollama import OllamaEmbeddings,ChatOllama

class  Model:
    def __init__(self, model_name, api_key=''):
        self.api_key = api_key
        self.model_name = model_name
    def chat_model(self,company='openai'):
        if company=='openai':
            return ChatOpenAI(openai_api_key=self.api_key, model_name=self.model_name,streaming=True)
        elif company=='ollama':
            return ChatOllama(model=self.model_name,base_url='http://localhost:11434',streaming=True)
    def embedding_model(self,dimensions=1536,company='openai'):
        if company=='openai':
            return OpenAIEmbeddings(openai_api_key=self.api_key, model=self.model_name, dimensions=dimensions)
        elif company=='ollama':
            return OllamaEmbeddings(model='nomic-embed-text',base_url='http://localhost:11434')