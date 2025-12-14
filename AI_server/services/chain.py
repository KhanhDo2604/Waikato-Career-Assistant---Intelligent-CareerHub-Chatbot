class Chat:
    def __init__(self,user_id:str):
        self.user_id = user_id
        self.chat_history = []
    
    def append_message(self,question:str,answer:str):
        self.chat_history.append({"question":question,"answer":answer})

    def get_history(self):
        return self.chat_history