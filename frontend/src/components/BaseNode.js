// BaseNode.js
import { ColoredHandle } from "./ColoredHandle";
import { NodeHeader } from "./NodeHeader";

const colorMap = {
  llm: {
    border: "border-llm-200",
    header: "bg-llm-100",
    text: "text-llm-700",
  },
  text: {
    border: "border-text-200",
    header: "bg-text-100",
    text: "text-text-700",
  },
  input: {
    border: "border-input-200",
    header: "bg-input-100",
    text: "text-input-700",
  },
  email: {
    border: "border-email-200",
    header: "bg-email-100",
    text: "text-email-700",
  },
  neutral: {
    border: "border-neutral-200",
    header: "bg-neutral-50",
    text: "text-neutral-700",
  },
};

export const BaseNode = ({
  id,
  data,
  title,
  icon: Icon,
  color = "neutral",
  width = 280, // Default fixed width
  minWidth, // Optional: for dynamic width expansion
  maxWidth, // Optional: for dynamic width expansion
  children,
  handles = [],
  style = {},
}) => {
  const colors = colorMap[color] || colorMap.neutral;

  // Determine width styling based on whether dynamic width is enabled
  const widthStyle =
    minWidth && maxWidth
      ? { minWidth: `${minWidth}px`, maxWidth: `${maxWidth}px`, width: "auto" }
      : { minWidth: `${width}px`, maxWidth: `${width}px` };

  return (
    <div
      className={`bg-white ${colors.border} border-2 rounded-xl shadow-node hover:shadow-node-hover transition-all duration-200 overflow-visible relative`}
      style={{
        ...widthStyle,
        ...style,
      }}
    >
      {/* Handles */}
      {handles.map((handle, index) => (
        <ColoredHandle
          key={handle.id || `${id}-handle-${index}`}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={handle.style}
          label={handle.label}
          data-nodeid={id}
        />
      ))}

      <NodeHeader
        title={title}
        nodeType={title.toLowerCase()}
        icon={Icon}
        id={id}
      />

      {/* Body */}
      <div className="p-3">{children}</div>
    </div>
  );
};
