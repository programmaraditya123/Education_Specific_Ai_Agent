# main.py or Server.py

from typing import TypedDict, Optional
from langgraph.graph import StateGraph, START, END

from templates.career_guidance_template import StructuredAdvice, generate_career_guidance_chain


# --- State Definition ---

class CareerFormInput(TypedDict):
    education: str
    interests: str
    query: str
    advice: Optional[StructuredAdvice]


# --- Node Function ---

def generate_advice_node(state: CareerFormInput):
    """Takes user input and generates a structured career plan."""
    
    chain = generate_career_guidance_chain()
    
    response = chain.invoke({
        "education": state['education'],
        "interests": state['interests'],
        "query": state['query']
    })
    
    return {"advice": response}


# --- LangGraph Setup ---

graph = StateGraph(CareerFormInput)
graph.add_node("generate_advice", generate_advice_node)
graph.add_edge(START, "generate_advice")
graph.add_edge("generate_advice", END)

career_bot = graph.compile()
