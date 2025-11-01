import faiss
from langchain_community.vectorstores import FAISS
# from langchain_community.embeddings import OpenAIEmbeddings
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from dotenv import load_dotenv
load_dotenv()

def build_vector_store(pdf_text: str):
    # Split text into chunks
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text(pdf_text)
    docs = [Document(page_content=chunk) for chunk in chunks]

    # Create FAISS vector store
    embeddings = OpenAIEmbeddings()
    vector_store = FAISS.from_documents(docs, embeddings)
    return vector_store
