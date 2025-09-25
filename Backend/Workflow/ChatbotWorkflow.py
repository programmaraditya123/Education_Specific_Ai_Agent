from typing import TypedDict,List,Annotated
from langchain_core.messages import BaseMessage,HumanMessage,SystemMessage
from langgraph.graph import StateGraph,START,END
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph.message import add_messages
from dotenv import load_dotenv


load_dotenv()


class ChatState(TypedDict):
    messages:Annotated[list[BaseMessage],add_messages]   #it stores the conversation history


model = ChatGoogleGenerativeAI(model="gemini-2.5-flash")

def call_llm(state:ChatState):
    res = model.invoke(state['messages'])
    print(state['messages'])
    return {'messages':[res]}
   


#define or build the graph
graph = StateGraph(ChatState)

# Nodes

graph.add_node("call_llm",call_llm)

#add edges between the nodes

graph.add_edge(START,"call_llm")

graph.add_edge("call_llm",END)

checkpointer = MemorySaver()

chatbot = graph.compile(checkpointer=checkpointer)



# while True:
#     userMessage = input("Type here..")
#     print(userMessage)

#     if userMessage.strip().lower() in ["exit","quit","bye"]:
#         break

#     config = {'configurable':{'thread_id':"thread-1"}}

#     response = chatbot.invoke({'messages':[HumanMessage(content=userMessage)]},config=config)
#     print("AI",response['messages'][-1].content)


