// draggableNode.js
import {
  MdApi,
  MdFilterList,
  MdInput,
  MdOutlineEmail,
  MdOutlineTransform,
  MdOutput,
  MdTextFields,
  MdTimer
} from "react-icons/md";
import { SiOpenai } from "react-icons/si";

// Icon mapping for different node types
const getNodeIcon = (type) => {
  const iconMap = {
    customInput: MdInput,
    customOutput: MdOutput,
    text: MdTextFields,
    llm: SiOpenai,
    api: MdApi,
    delay: MdTimer,
    filter: MdFilterList,
    email: MdOutlineEmail,
    transform: MdOutlineTransform,
  };

  return iconMap[type] || MdTextFields;
};

export const DraggableNode = ({ type, label }) => {
  const IconComponent = getNodeIcon(type);

  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = "grabbing";
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="cursor-grab min-w-[90px] h-[70px] flex items-center justify-center flex-col rounded-lg bg-white border border-neutral-200 gap-1 p-2 m-1 hover:border-indigo-400 hover:shadow-md transition-all"
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = "grab")}
      draggable
    >
      <div className="flex items-center justify-center">
        <IconComponent size={20} className="text-neutral-700" />
      </div>
      <div className="flex items-center justify-center">
        <span className="text-neutral-700 text-[11px] font-normal text-center leading-tight">
          {label}
        </span>
      </div>
    </div>
  );
};
