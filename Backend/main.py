from fastapi import FastAPI, UploadFile, Form
from pydantic import BaseModel
from Workflow.ChatbotWorkflow import chatbot
from langchain_core.messages import HumanMessage, SystemMessage
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from fastapi.responses import Response
from fastapi.responses import StreamingResponse,JSONResponse
from Workflow.CareerGuidance import StructuredAdvice, career_bot
import asyncio
from Modules.summarizer.chain import get_summary_chain
# from langchain_community.chains import RetrievalQA
from Modules.summarizer.vector_store import build_vector_store,Document
from Workflow.PdfWorkflow import build_langgraph
from PyPDF2 import PdfReader
import io
vector_store_memory = None

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


class CareerRequest(BaseModel):
    education: str
    interests: str
    query: str

class CareerResponse(BaseModel):
    advice: StructuredAdvice


@app.get('/')
def root():
    return {"hello": "This is the home page"}

@app.get('/health')
def health():
    return {"status":"ok"}


@app.post('/chat')
async def chat_endpoint(request: ChatRequest):
    config = {'configurable': {'thread_id': request.thread_id}}
    async def generate():
        response = chatbot.invoke({'messages': [SystemMessage(content="You are a helpful AI assistant for an e-learning platform. "
                              "Always answer concisely and politely.""If question is not about education or learning , you say ask questions only from learning point of view in your way"), HumanMessage(content=request.user_message)]}, config=config)
        text =  response['messages'][-1].content

        for word in text.split():
            yield word+" "
            await asyncio.sleep(0.05)

    return StreamingResponse(generate(), media_type="text/plain")


# ['messages'][-1].content




# @app.post("/summarize")
# async def summarize_pdf(file: UploadFile):
#     # Read PDF content
#     pdf_reader = PdfReader(io.BytesIO(await file.read()))
#     text = " ".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])

#     # Build vector store and chain
#     vector_store = build_vector_store(text)
#     chain = get_summary_chain(vector_store)

#     # Build LangGraph and run summarization
#     graph = build_langgraph()
#     app_flow = graph.compile()
#     result = app_flow.invoke({"pdf_text": text, "chain": chain})

#     return {"summary": result["summary"]} 


@app.post("/summarize")
async def summarize_pdf(file: UploadFile):
    global vector_store_memory

    # Extract text
    pdf_reader = PdfReader(io.BytesIO(await file.read()))
    text = " ".join([page.extract_text() for page in pdf_reader.pages if page.extract_text()])

    # Build FAISS and chain
    vector_store = build_vector_store(text)
    vector_store_memory = vector_store  # store for later Q&A
    chain = get_summary_chain(vector_store)

    # LangGraph summarization
    graph = build_langgraph()
    app_flow = graph.compile()
    result = app_flow.invoke({"pdf_text": text, "chain": chain})

    return {"summary": result["summary"]}


@app.post("/ask")
async def ask_question(question: str = Form(...)):
    global vector_store_memory

    if not vector_store_memory:
        return {"answer": "Please upload a PDF first."}

    # Create retriever and LLM chain again
    chain = get_summary_chain(vector_store_memory)

    response = chain.invoke({"query": question})
    answer = response["result"]

    return {"answer": answer}


@app.post("/career-guidance", response_model=CareerResponse, tags=["Career Guidance"])
async def career_guidance_endpoint(request: CareerRequest):
    """
    Accepts user's education, interests, and query to generate career advice.
    """
    inputs = request.dict()
    final_state = career_bot.invoke(inputs)

    # This return statement is now correct because it matches the updated CareerResponse
    return {"advice": final_state.get("advice")}


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


@app.get("/ping")
async def ping():
    return {"message": "pong"}


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))  # Default to 8080 if PORT not set
    uvicorn.run(app, host="0.0.0.0", port=port)
