// components/NodeHeader.js - Styled node header component

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
import { PiX } from "react-icons/pi";
import { SiOpenai } from "react-icons/si";
import { useStore } from "../store";

const getNodeIcon = (nodeType) => {
  const iconMap = {
    input: MdInput,
    output: MdOutput,
    text: MdTextFields,
    llm: SiOpenai,
    "api request": MdApi,
    delay: MdTimer,
    filter: MdFilterList,
    email: MdOutlineEmail,
    transform: MdOutlineTransform,
  };
  return iconMap[nodeType] || MdTextFields;
};

const getHeaderColors = (nodeType) => {
  const colorMap = {
    input: "bg-blue-50 border-b border-blue-100 text-blue-700",
    output: "bg-slate-50 border-b border-slate-100 text-slate-700",
    text: "bg-indigo-50 border-b border-indigo-100 text-indigo-700",
    llm: "bg-purple-50 border-b border-purple-100 text-purple-700",
    "api request": "bg-orange-50 border-b border-orange-100 text-orange-700",
    delay: "bg-gray-50 border-b border-gray-100 text-gray-700",
    filter: "bg-teal-50 border-b border-teal-100 text-teal-700",
    email: "bg-rose-50 border-b border-rose-100 text-rose-700",
    transform: "bg-cyan-50 border-b border-cyan-100 text-cyan-700",
  };
  return (
    colorMap[nodeType] || "bg-gray-50 border-b border-gray-100 text-gray-700"
  );
};

export const NodeHeader = ({ title, subtitle, nodeType, id }) => {
  const IconComponent = getNodeIcon(nodeType);
  const headerColor = getHeaderColors(nodeType);
  const deleteNode = useStore((state) => state.deleteNode);

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteNode(id);
  };

  return (
    <div
      className={`px-2 py-1 rounded-lg ${headerColor} m-2 mb-0 border border-gray-200`}
    >
      <div className="flex items-center gap-1">
        <IconComponent className="w-4 h-4" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate">{title}</h3>
          {subtitle && (
            <p className="text-xs opacity-75 mt-0.5 leading-tight">
              {subtitle}
            </p>
          )}
        </div>
        {/* Close button */}

        <button
          onClick={handleDelete}
          className=" w-[12px] h-[12px] border-[1px] border-gray-400 hover:border-gray-700 text-white rounded-full flex items-center justify-center transition-colors z-10 "
          aria-label="Delete node"
        >
          <PiX
            className="w-2 h-2 text-gray-500 hover:text-gray-700"
            strokeWidth={20}
          />
        </button>
      </div>
    </div>
  );
};
