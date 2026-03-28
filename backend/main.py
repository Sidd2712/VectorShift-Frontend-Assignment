import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import networkx as nx

app = FastAPI()

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development convenience
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response
class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str | None = None
    targetHandle: str | None = None


class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any] = {}


class PipelineData(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse", response_model=PipelineResponse)
def parse_pipeline(pipeline_data: PipelineData):
    """
    Parse the pipeline and return statistics about nodes, edges, and DAG status.
    """
    try:
        nodes = pipeline_data.nodes
        edges = pipeline_data.edges

        num_nodes = len(nodes)
        num_edges = len(edges)

        # Create a directed graph using NetworkX
        G = nx.DiGraph()

        # Add nodes
        for node in nodes:
            G.add_node(node.id)

        # Add edges
        for edge in edges:
            G.add_edge(edge.source, edge.target)

        # Check if DAG using NetworkX
        is_dag = nx.is_directed_acyclic_graph(G)

        return PipelineResponse(num_nodes=num_nodes, num_edges=num_edges, is_dag=is_dag)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error parsing pipeline: {str(e)}")


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
