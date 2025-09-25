from fastapi import FastAPI
from pydantic import BaseModel
from Workflow.ChatbotWorkflow import chatbot
# from .Workflow.ChatbotWorkflow import chatbot
from langchain_core.messages import HumanMessage, SystemMessage
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] for all
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


@app.post('/chat')
async def chat_endpoint(request: ChatRequest):
    config = {'configurable': {'thread_id': request.thread_id}}
    response = chatbot.invoke({'messages': [SystemMessage(content="You are a helpful AI assistant for an e-learning platform. "
                              "Always answer concisely and politely.""If question is not about education or learning , you say ask questions only from learning point of view in your way"), HumanMessage(content=request.user_message)]}, config=config)
    return response['messages'][-1].content
