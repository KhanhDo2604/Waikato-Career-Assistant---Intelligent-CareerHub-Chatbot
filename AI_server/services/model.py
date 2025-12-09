from langchain_ollama import OllamaEmbeddings

class Model:
    def __init__(self,model_name: str):
        self.model_name = model_name
        self.embedding_model = self.load_embedding_model()
    
    def load_embedding_model(self):
        return OllamaEmbeddings(model=self.model_name)