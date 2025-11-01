from langchain.chains import RetrievalQA
# from langchain_community.llms import OpenAI
from langchain_openai import OpenAI
from dotenv import load_dotenv
load_dotenv()


def get_summary_chain(vector_store):
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})

    llm = OpenAI(temperature=0.3)
    chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )
    return chain
