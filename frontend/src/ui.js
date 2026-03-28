// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useCallback, useRef, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import { shallow } from "zustand/shallow";
import ButtonEdge from "./components/ButtonEdge";
import {
  APINode,
  DelayNode,
  EmailNode,
  FilterNode,
  InputNode,
  LLMNode,
  OutputNode,
  TextNode,
  TransformNode,
} from "./nodes";
import { useStore } from "./store";

import "reactflow/dist/style.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  transform: TransformNode,
  filter: FilterNode,
  api: APINode,
  delay: DelayNode,
  email: EmailNode,
};

const edgeTypes = {
  customEdge: ButtonEdge,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };

    // Add type-specific initial data
    switch (type) {
      case "customInput":
        nodeData.inputName = nodeID.replace("customInput-", "input_");
        nodeData.inputType = "Text";
        break;
      case "customOutput":
        nodeData.outputName = nodeID.replace("customOutput-", "output_");
        nodeData.outputType = "Text";
        break;
      case "text":
        nodeData.text = "Hi, How are you?";
        break;
      case "api":
        nodeData.url = "https://api.example.com";
        nodeData.method = "GET";
        nodeData.headers = "{'Content-Type': 'application/json'}";
        nodeData.timeout = "10";
        break;
      case "delay":
        nodeData.seconds = "1";
        break;
      case "filter":
        nodeData.condition = "value > 0";
        break;
      case "email":
        nodeData.to = "user@example.com";
        nodeData.subject = "New Message";
        break;
      case "webhook":
        nodeData.url = "https://hooks.example.com";
        break;
      default:
        break;
    }

    return nodeData;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );
        const type = appData?.nodeType;

        // check if the dropped element is valid
        if (typeof type === "undefined" || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <>
      <div ref={reactFlowWrapper} style={{ width: "100wv", height: "86vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          proOptions={proOptions}
          snapGrid={[gridSize, gridSize]}
          connectionLineType="smoothstep"
        >
          <Background color="#aaa" gap={gridSize} />
          <Controls
            position="bottom-right"
            style={{
              bottom: 0,
              right: 220, // Position to the left of minimap
              display: "flex",
              flexDirection: "column",
            }}
          />
          <MiniMap />
        </ReactFlow>
      </div>
    </>
  );
};
