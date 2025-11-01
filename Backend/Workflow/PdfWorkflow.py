from langgraph.graph import StateGraph, END
from typing import TypedDict

class SummarizeState(TypedDict):
    pdf_text: str
    chain: object
    summary: str

def summarize_large_text(chain, text, chunk_size=3000):
    """Breaks the text into smaller chunks and summarizes each."""
    words = text.split()
    summaries = []

    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        try:
            res = chain.invoke({"query": f"Summarize this portion briefly:\n{chunk}"})
            summaries.append(res["result"])
        except Exception as e:
            print(f"Error summarizing chunk {i // chunk_size + 1}: {e}")

    # Combine mini summaries into a final concise summary
    combined_text = "\n\n".join(summaries)
    final_res = chain.invoke({
        "query": f"Combine the following summaries into a single concise overview:\n{combined_text}"
    })
    return final_res["result"]

def build_langgraph():
    def summarize_node(state: SummarizeState):
        text = state["pdf_text"]
        chain = state["chain"]
        response = summarize_large_text(chain, text)
        return {"summary": response}

    graph = StateGraph(SummarizeState)
    graph.add_node("summarize", summarize_node)
    graph.set_entry_point("summarize")
    graph.add_edge("summarize", END)
    return graph





# from langgraph.graph import StateGraph, END
# from typing import TypedDict

# class SummarizeState(TypedDict):
#     pdf_text: str
#     chain: object
#     summary: str

# def build_langgraph():
#     def summarize_node(state: SummarizeState):
#         text = state["pdf_text"]
#         chain = state["chain"]
#         response_dict = chain.invoke({"query": f"Summarize this document:\n{text}"})
#         response = response_dict["result"]
#         return {"summary": response}

#     graph = StateGraph(SummarizeState)
#     graph.add_node("summarize", summarize_node)
#     graph.set_entry_point("summarize")
#     graph.add_edge("summarize", END)
#     return graph
