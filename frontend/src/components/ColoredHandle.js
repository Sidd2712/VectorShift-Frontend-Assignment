// ColoredHandle.js - A Handle component that changes color based on connected edge state
import { Handle } from "reactflow";
import { useStore } from "../store";
import { useMemo } from "react";

export const ColoredHandle = ({
  id,
  type,
  position,
  style,
  label,
  ...props
}) => {
  const edges = useStore((state) => state.edges);
  const clickedEdges = useStore((state) => state.clickedEdges);

  // Find if this handle is connected to any edge
  const isConnected = useMemo(() => {
    return edges.some((edge) => {
      if (type === "source") {
        return edge.source === props["data-nodeid"] && edge.sourceHandle === id;
      } else {
        return edge.target === props["data-nodeid"] && edge.targetHandle === id;
      }
    });
  }, [edges, id, type, props]);

  // Find if this handle is connected to any clicked edge
  const isConnectedToClickedEdge = useMemo(() => {
    const connectedEdges = edges.filter((edge) => {
      if (type === "source") {
        return edge.source === props["data-nodeid"] && edge.sourceHandle === id;
      } else {
        return edge.target === props["data-nodeid"] && edge.targetHandle === id;
      }
    });

    return connectedEdges.some((edge) => clickedEdges[edge.id]);
  }, [edges, clickedEdges, id, type, props]);

  // Determine handle color based on connection and clicked state
  const handleColor = isConnectedToClickedEdge ? "#ff0000" : "#6366f1";
  const backgroundColor = isConnected ? handleColor : "white";

  return (
    <>
      <Handle
        id={id}
        type={type}
        position={position}
        className={
          isConnectedToClickedEdge ? "handle-clicked" : "handle-normal"
        }
        style={{
          ...style,
          "--handle-color": handleColor,
          backgroundColor: backgroundColor,
        }}
        {...props}
      />
      {label && (
        <div
          style={{
            position: "absolute",
            top: style?.top || "50%",
            transform: "translateY(-50%)",
            ...(type === "source" ? { right: "-35px" } : { left: "-60px" }),
            fontSize: "10px",
            fontWeight: "600",
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {label}
        </div>
      )}
    </>
  );
};
