// VariableChip.js
import React from "react";
import { PiX } from "react-icons/pi";

export const VariableChip = ({ variable, onRemove }) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-200 hover:bg-blue-100 transition-colors">
      <span>{variable}</span>
      <button
        onClick={onRemove}
        className="p-0.5 hover:bg-blue-200 rounded transition-colors"
        aria-label={`Remove ${variable}`}
      >
        <PiX className="w-3 h-3" />
      </button>
    </div>
  );
};
