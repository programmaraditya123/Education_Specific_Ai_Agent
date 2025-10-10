from fastapi import FastAPI
from pydantic import BaseModel
from Workflow.ChatbotWorkflow import chatbot
from langchain_core.messages import HumanMessage, SystemMessage
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from fastapi.responses import Response
from fastapi.responses import StreamingResponse

app = FastAPI()

origins = [
    "http://localhost:3000",            
    "https://knowledgepoll.site", 
    "https://test-your-internet-speed.knowledgepoll.site"     
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=False,
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
    


 


@app.get("/download")
async def download_file():
    size_mb = 50
    chunk_size = 1024 * 1024   

    async def file_stream():
        for _ in range(size_mb):
            yield os.urandom(chunk_size)

    response = StreamingResponse(file_stream(), media_type="application/octet-stream")
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response

@app.post("/upload")
async def upload_file(file: bytes = None):
    return {"size_bytes": len(file or b"")}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))  # Default to 8080 if PORT not set
    uvicorn.run(app, host="0.0.0.0", port=port)
