# VectorShift Frontend Technical Assessment

This repository contains the completed technical assessment for the Frontend Engineer role at VectorShift. The project involves building a modular, node-based pipeline builder using React (React Flow) and a FastAPI backend for graph analysis.
 
 
 ## Features
 ###Part 1: Node Abstraction
Base Node Component: Created a high-level abstraction for nodes to eliminate redundant code across different node types.
Shared Functionality: Centralized styling, handle logic, and container structures.
5 New Custom Nodes:
Note Node: For user annotations.
Database Node: Represents data sources.
Integration Node: For 3rd party API connections.
Logic Node: For conditional branching.
Prompt Node: Specifically for LLM prompt engineering.
Part 2: Modern Styling
Unified Design System: Implemented a cohesive, professional UI using modern CSS principles.
Visual Feedback: Added hover states, clear handle indicators, and polished node borders.
Enhanced Layout: Improved the toolbar and submission interface for better user experience.
Part 3: Text Node Intelligence
Auto-Resizing: The text input field dynamically adjusts the node's dimensions based on the amount of content entered.
Dynamic Variable Detection:
Supports {{ variable_name }} syntax.
Automatically creates a new input Handle on the left side of the node for every unique variable detected in the text.
Part 4: Backend Integration & DAG Validation
Submit Integration: The submit.js component now sends the current pipeline state (nodes and edges) to the backend.
Graph Analysis:
The FastAPI backend calculates the total count of nodes and edges.
Implemented a Directed Acyclic Graph (DAG) check to ensure the pipeline has no circular dependencies.
Interactive Alerts: Displays a user-friendly modal/alert showing the number of nodes, edges, and whether the pipeline is a valid DAG.
 Tech Stack
Frontend: React, JavaScript, React Flow, CSS/Tailwind.
Backend: Python, FastAPI.
 Setup Instructions
Frontend
Navigate to the /frontend directory:
cd frontend


Install dependencies:
npm install


Start the development server:
npm start


Backend
Navigate to the /backend directory:
cd backend


Install required Python packages:
pip install fastapi uvicorn


Run the server:
uvicorn main:app --reload


 Implementation Details
DAG Logic: The backend uses a Depth First Search (DFS) approach to detect cycles within the submitted edge list.
Abstraction: Used a wrapper pattern for nodes, allowing new nodes to be defined by simply passing configuration objects for handles and internal components.
