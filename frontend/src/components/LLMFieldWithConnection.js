// LLMFieldWithConnection.js
import React from "react";
import { useStore } from "../store";
import { shallow } from "zustand/shallow";

export const LLMFieldWithConnection = ({
  nodeId,
  fieldName,
  placeholder,
  value,
  onChange,
}) => {
  const edges = useStore((state) => state.edges, shallow);
  const nodes = useStore((state) => state.nodes, shallow);

  // Check if this field's handle is connected
  const handleId = `${nodeId}-${fieldName}`;
  const connectedEdge = edges.find(
    (edge) => edge.target === nodeId && edge.targetHandle === handleId
  );

  console.log("nodeId",   nodeId);
  console.log("connectedEdge", connectedEdge);


  // Get the source node name if connected
  let connectedInputName = null;
  if (connectedEdge) {
    const sourceNode = nodes.find((n) => n.id === connectedEdge.source);
    if (sourceNode) {
      connectedInputName =
        sourceNode.data?.inputName || sourceNode.data?.name || sourceNode.id;
    }
  }

  // If connected, show the chip indicator (read-only display)
  if (connectedInputName) {
    return (
      <div className="flex flex-col gap-1">
        <div className="w-full min-h-[80px] px-2.5 py-2 text-sm border border-neutral-300 rounded-md bg-neutral-50">
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 border border-orange-300 rounded text-xs text-orange-700">
              <span className="font-medium">{connectedInputName}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not connected, show regular textarea for user input
  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full min-h-[80px] resize-none px-2.5 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
      </div>
    </div>
  );
};
