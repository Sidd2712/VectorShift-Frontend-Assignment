// VariableAutocomplete.js
import React from "react";

export const VariableAutocomplete = ({ options, onSelect, onClose }) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="absolute top-full left-0 w-full z-50 bg-white border border-neutral-300 rounded-md shadow-lg max-h-[150px] overflow-y-auto mt-1">
      {options.map((option) => (
        <div
          key={option.id || option.value}
          onClick={() => onSelect(option.value)}
          className="px-3 py-2 text-sm cursor-pointer border-b border-neutral-100 last:border-b-0 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
        >
          {option.label || option.value}
        </div>
      ))}
    </div>
  );
};
