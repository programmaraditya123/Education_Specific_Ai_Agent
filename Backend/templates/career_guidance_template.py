# templates/career_guidance_template.py

from typing import List
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

# Initialize the Gemini model
model = ChatGoogleGenerativeAI(model="gemini-2.5-flash")


# --- Structured Output Models ---
# ... = ellipsis , description: 
class CareerPath(BaseModel):
    path_title: str = Field(..., description="The title of the career path which the user want to pursue")
    description: str = Field(..., description="A brief description of what this role entails.")


class ActionableRoadmap(BaseModel):
    """A structured roadmap with distinct phases."""
    phase_1_fundamentals: List[str] = Field(..., description="List of fundamental skills to learn in the first 3-4 months.")
    phase_2_framework: List[str] = Field(..., description="List of framework-related skills to learn in the next 4-6 months.")
    phase_3_specialize: List[str] = Field(..., description="List of advanced skills and topics for specialization.")

class StructuredAdvice(BaseModel):
    """The main structured response for career guidance."""
    summary_and_advice: str = Field(..., description="A concise summary and initial advice, addressing the user's core dilemma.")
    potential_career_paths: List[CareerPath] = Field(..., description="A list of 2-3 potential interest career paths.")
    actionable_roadmap: ActionableRoadmap = Field(..., description="A step-by-step, phased plan for the user to follow.")
    final_conclusion: str = Field(..., description="A final, encouraging concluding thought.")


# --- Prompt Template + Chain ---

def generate_career_guidance_chain():
    """Returns a chain that produces structured career guidance."""
    
    structured_llm = model.with_structured_output(StructuredAdvice)
    
    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            """You are an expert career counselor . 
            Analyze the user's profile and generate a concise, actionable, and encouraging career plan. 
            You MUST populate all the fields in the provided structured format.
            If fields are unclear, respond only with the 'advice' field containing 'summary_and_advice'."""
        ),
        (
            "human",
            """Please generate a  career plan based on my profile:
            - Education: {education}
            - Interests: {interests}
            - Query: {query}"""
        ),
    ])
    
    return prompt | structured_llm
