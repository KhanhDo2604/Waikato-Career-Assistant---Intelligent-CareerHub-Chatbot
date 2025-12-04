# Set up Ai Server
Before set up Ai Server, you need to install two Ai models and some softwares. please make sure you have over 10G spare space. 

- [docker](https://docs.docker.com/get-started/introduction/get-docker-desktop/)
- [Ollama](https://ollama.com/)


When you finished, please use docker to download Milvus.Notice, you need to download Milvus standalone version. [Please, follow the offical instruction to download](https://milvus.io/docs/install_standalone-windows.md) 
Also, you need to use Ollama to download two models.

```sh
ollama pull llama3
```
```sh
ollama pull nomic-embed-text
```

you can use `ollama list` to check if models have been download

This AI Server should run on python 3.13.2. Please inistal python virtual environment first before running programe.
After that, use `pip install -r requirement.txt` to install all python packages.
Set up Milvus by docker and use `uvicorn main:app --reload` command to run AI server program.