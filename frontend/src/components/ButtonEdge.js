import { useEffect, useState } from "react";
import { PiX } from "react-icons/pi";
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from "reactflow";
import { useStore } from "../store";

export default function ButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const removeEdge = useStore((state) => state.removeEdge);
  const setEdgeClicked = useStore((state) => state.setEdgeClicked);
  const [clickedOnce, setClickedOnce] = useState(false);

  const onButtonClick = (evt) => {
    evt.stopPropagation();
    if (clickedOnce) {
      removeEdge(id);
    } else {
      setClickedOnce(true);
    }
  };

  // // Auto-reset after 5 seconds if user doesn't click again
  useEffect(() => {
    if (clickedOnce) {
      const timer = setTimeout(() => {
        setClickedOnce(false);
      }, 4000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [clickedOnce]);

  useEffect(() => {
    setEdgeClicked(id, clickedOnce);

    return () => {
      setEdgeClicked(id, false);
    };
  }, [clickedOnce, id, setEdgeClicked]);

  // Determine edge color based on state
  const edgeColor = clickedOnce
    ? "#ff0000" // Red when clicked (warning to delete)
    : "#6366f1"; // Indigo (normal state)

  // Update the marker end color to match the edge
  const customMarkerEnd = {
    ...markerEnd,
    color: edgeColor,
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={customMarkerEnd}
        style={{
          ...style,
          stroke: edgeColor,
          strokeWidth: 2,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan "
        >
          <button
            style={{
              width: "20px",
              height: "20px",
              background: clickedOnce ? "#ff0000" : "#f9f9f9",
              color: clickedOnce ? "white" : "#6366f1",
              border: clickedOnce ? "2px solid white" : "2px solid #6366f1",
              cursor: "pointer",
              boxShadow: clickedOnce ? "0px 0px 0 1px #ff0000" : "",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "14px",
              lineHeight: "1",
              transition: "background-color 0.2s",
            }}
            onClick={onButtonClick}
            title={
              clickedOnce ? "Click again to remove" : "Click twice to remove"
            }
          >
            <PiX className="w-3 h-3 font-bold" strokeWidth={20} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
