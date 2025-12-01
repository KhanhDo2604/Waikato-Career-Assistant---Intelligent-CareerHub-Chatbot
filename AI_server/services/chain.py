from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from operator import itemgetter
import json

user_session = {}

class ChatChain:
    def __init__(self, vector_store, model, template,multi_turn=False):
        self.vector_store = vector_store
        self.model = model
        self.prompt = ChatPromptTemplate.from_template(template=template)
        self.parser = StrOutputParser()
        self.chat_history = []
        self.chain = self.create_chain(multi_turn)

    def create_chain(self,multi_turn=False):
        if not multi_turn:
            return(
            {"context": itemgetter("question") | self.vector_store.as_retriever(k=4),"question": itemgetter("question"),}
            | self.prompt
            | self.model
            | self.parser
        )
        else:
            return(
            {"context": itemgetter("question") | self.vector_store.as_retriever(k=4),"question": itemgetter("question"), "chat_history": itemgetter("chat_history")}
            | self.prompt
            | self.model
            | self.parser
        )

    async def ask_question_stream(self,question:str):
        try:
            full_answer = ''
            async for chunk in self.chain.astream({
                "question": question,
                "chat_history": "\n".join(self.chat_history)
            }):
                full_answer += chunk
                yield chunk
            self.chat_history.append(f"User: {question}")
            self.chat_history.append(f"Assistant: {full_answer}")
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            yield "1"

    async def ask_question(self,question:str):
        try:
            answer = await self.chain.ainvoke({
                "question": question,
                "chat_history": "\n".join(self.chat_history)
            })
            self.chat_history.append(f"User: {question}")
            self.chat_history.append(f"Assistant: {answer}")
            return answer
        except Exception as e:
            print(f"Error occurred: {str(e)}")
            return "1"
        
    async def get_most_relevant_document(self, question: str):
        retriever = self.vector_store.as_retriever(k=4)
        docs = await retriever.ainvoke(question)
        if docs:
            return [content.page_content for content in docs]
        else:
            return []