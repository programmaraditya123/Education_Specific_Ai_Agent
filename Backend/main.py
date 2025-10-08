from fastapi import FastAPI
from pydantic import BaseModel
from Workflow.ChatbotWorkflow import chatbot
# from .Workflow.ChatbotWorkflow import chatbot
from langchain_core.messages import HumanMessage, SystemMessage
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
# from Modules.internetspeedtest.speedtest_module import speedtest_info,get_servers
# from fastapi.concurrency import run_in_threadpool
from fastapi.responses import Response

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] for all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    user_message: str
    thread_id: str = "thread-1"


@app.get('/')
def root():
    return {"hello": "This is the home page"}

@app.get('/health')
def health():
    return {"status":"ok"}


@app.post('/chat')
async def chat_endpoint(request: ChatRequest):
    config = {'configurable': {'thread_id': request.thread_id}}
    response = chatbot.invoke({'messages': [SystemMessage(content="You are a helpful AI assistant for an e-learning platform. "
                              "Always answer concisely and politely.""If question is not about education or learning , you say ask questions only from learning point of view in your way"), HumanMessage(content=request.user_message)]}, config=config)
    return response['messages'][-1]
    


#routes for internet speed test
# @app.get('/speedtest')
# async def speedtest():
#     return await run_in_threadpool(speedtest_info)

# @app.get('/get_servers')
# async def get_servers_info():
#     return await run_in_threadpool(get_servers)


# Endpoint to test download speed
@app.get("/download")
async def download_file():
    size_mb = 50  # adjust size
    data = os.urandom(size_mb * 1024 * 1024)  # generate random bytes
    return Response(content=data, media_type="application/octet-stream")

# Endpoint to test upload speed
@app.post("/upload")
async def upload_file(file: bytes = None):
    # We just accept the file, no need to store
    return {"size_bytes": len(file or b"")}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))  # Default to 8080 if PORT not set
    uvicorn.run(app, host="0.0.0.0", port=port)
