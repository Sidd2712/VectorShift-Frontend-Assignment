// DynamicHandleGenerator.js
import { useEffect, useState, useRef } from "react";
import { Position, useUpdateNodeInternals } from "reactflow";
import { ColoredHandle } from "./ColoredHandle";

export const DynamicHandleGenerator = ({ nodeId, text }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const [handles, setHandles] = useState([]);
  const [generation, setGeneration] = useState(0);
  const previousHandlesRef = useRef([]);

  useEffect(() => {
    // Regex to match {{ variable }}
    const variableRegex = /{{(?:\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*)}}/g;
    const matches = [...text.matchAll(variableRegex)];
    const uniqueVariables = [...new Set(matches.map((m) => m[1]))];

    const newHandles = uniqueVariables.map((variable, index) => ({
      id: `${nodeId}-var-${variable}`,
      type: "target",
      position: Position.Left,
      style: { top: `${(index + 1) * (100 / (uniqueVariables.length + 1))}%` },
      variableName: variable,
      generation, // Add generation for key forcing
    }));

    // Serialize handles for comparison
    const serializeHandles = (handleList) =>
      handleList
        .map((h) => `${h.id}:${h.style?.top}`)
        .sort()
        .join("|");

    const currentSerialized = serializeHandles(previousHandlesRef.current);
    const newSerialized = serializeHandles(newHandles);

    if (currentSerialized !== newSerialized) {
      previousHandlesRef.current = newHandles;
      setHandles(newHandles);

      // Increment generation to force re-mount
      setGeneration((prev) => prev + 1);

      // Clean up invalid edges
      import("../store").then(({ useStore }) => {
        const currentEdges = useStore.getState().edges;
        const validHandleIds = new Set(newHandles.map((h) => h.id));

        const edgesToRemove = currentEdges
          .filter(
            (edge) =>
              edge.target === nodeId &&
              edge.targetHandle?.startsWith(`${nodeId}-var-`) &&
              !validHandleIds.has(edge.targetHandle)
          )
          .map((edge) => ({ id: edge.id, type: "remove" }));

        if (edgesToRemove.length > 0) {
          useStore.getState().onEdgesChange(edgesToRemove);
        }
      });

      // Aggressive update strategy
      const performUpdates = () => {
        // Force node data update to trigger complete re-render
        import("../store").then(({ useStore }) => {
          const currentNodes = useStore.getState().nodes;
          const nodeToUpdate = currentNodes.find((n) => n.id === nodeId);

          if (nodeToUpdate) {
            // Update node data with a timestamp to force re-render
            useStore
              .getState()
              .updateNodeField(nodeId, "_handleUpdateTimestamp", Date.now());
          }
        });

        // Update 1: Immediate
        updateNodeInternals(nodeId);

        // Update 2: Next frame
        requestAnimationFrame(() => {
          updateNodeInternals(nodeId);

          // Update 3: After layout settles
          setTimeout(() => {
            updateNodeInternals(nodeId);

            // Update 4: Final update to ensure edge paths are recalculated
            requestAnimationFrame(() => {
              updateNodeInternals(nodeId);

              // Update 5: Extra delayed update
              setTimeout(() => {
                updateNodeInternals(nodeId);
              }, 100);
            });
          }, 50);
        });
      };

      performUpdates();
    }
  }, [text, nodeId, updateNodeInternals, generation]);

  return (
    <>
      {handles.map((handle, index) => (
        <div
          key={`${handle.id}-gen${generation}`}
          className="absolute w-full h-full top-0 left-0 pointer-events-none"
        >
          <ColoredHandle
            key={`handle-${handle.id}-${handle.style.top}-${generation}`}
            type={handle.type}
            position={handle.position}
            id={handle.id}
            style={{ ...handle.style, pointerEvents: "all" }}
            data-nodeid={nodeId}
          />
          <div
            className="absolute text-[11px] text-neutral-500 whitespace-nowrap pr-1"
            style={{
              left: handle.position === Position.Left ? "-8px" : "100%",
              top: handle.style.top,
              transform: "translate(-100%, -50%)",
            }}
          >
            {handle.variableName}
          </div>
        </div>
      ))}
    </>
  );
};
