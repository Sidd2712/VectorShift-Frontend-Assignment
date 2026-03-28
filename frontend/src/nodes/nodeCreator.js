// nodeCreator.js
import { useState } from "react";
import { shallow } from "zustand/shallow";
import { AutoResizeTextarea } from "../components/AutoResizeTextarea";
import { BaseNode } from "../components/BaseNode";
import { DynamicHandleGenerator } from "../components/DynamicHandleGenerator";
import { DynamicWidthContainer } from "../components/DynamicWidthContainer";
import { LLMFieldWithConnection } from "../components/LLMFieldWithConnection";
import { VariableAutocomplete } from "../components/VariableAutocomplete";
import { VariableChip } from "../components/VariableChip";
import { useStore } from "../store";

export const createNode = (config) => {
  return ({ id, data }) => {
    // Initialize state
    const initialData = {};
    config.fields.forEach((field) => {
      if (field.name) {
        // Prefer data from props, fallback to empty string
        initialData[field.name] = data[field.name] || "";
      }
    });

    const [state, setState] = useState(initialData);

    // For Autocomplete logic
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [cursorPosition, setCursorPosition] = useState(0);
    const [activeFieldName, setActiveFieldName] = useState(null);

    // Access global store to sync changes if needed (custom logic for InputNode)
    const updateNodeField = useStore((state) => state.updateNodeField);

    // Also access nodes for autocomplete logic
    const allNodes = useStore((state) => state.nodes, shallow);

    // Sync local state changes to global store
    const handleChange = (name, value) => {
      setState((prev) => ({ ...prev, [name]: value }));
      updateNodeField(id, name, value);
    };

    // --- Autocomplete Logic ---
    const handleTextChange = (e, fieldName) => {
      const val = e.target.value;
      handleChange(fieldName, val);

      const cursorPos = e.target.selectionStart;
      setCursorPosition(cursorPos);
      setActiveFieldName(fieldName);

      const textBeforeCursor = val.slice(0, cursorPos);
      const lastOpenBrace = textBeforeCursor.lastIndexOf("{{");

      if (lastOpenBrace !== -1) {
        const textSinceOpen = textBeforeCursor.slice(lastOpenBrace + 2);
        if (!textSinceOpen.includes("}}")) {
          setShowAutocomplete(true);
          setFilterText(textSinceOpen.trim());
          return;
        }
      }
      setShowAutocomplete(false);
    };

    const insertVariable = (variableName) => {
      if (!activeFieldName) return;
      const currentText = state[activeFieldName];

      const textBeforeCursor = currentText.slice(0, cursorPosition);
      const lastOpenBrace = textBeforeCursor.lastIndexOf("{{");

      if (lastOpenBrace !== -1) {
        const newText =
          currentText.slice(0, lastOpenBrace) +
          `{{${variableName}}}` +
          currentText.slice(cursorPosition);

        handleChange(activeFieldName, newText);
        setShowAutocomplete(false);
      }
    };

    const availableInputNodes = allNodes
      .filter(
        (n) => n.type === "customInput" || n.data?.nodeType === "customInput"
      )
      .filter((n) => {
        const name = n.data?.inputName || n.id;
        return name.toLowerCase().includes(filterText.toLowerCase());
      });

    const extractVariables = (text) => {
      const variableRegex = /{{(?:\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(?:\s*)}}/g;
      const matches = [...text.matchAll(variableRegex)];
      return [...new Set(matches.map((m) => m[1]))];
    };

    const handleRemoveVariable = (fieldName, variable) => {
      const currentText = state[fieldName];
      const regex = new RegExp(`{{\\s*${variable}\\s*}}`, "g");
      const newText = currentText.replace(regex, "");
      handleChange(fieldName, newText);
    };

    const handles = config.handles
      ? config.handles.map((h) => ({
          ...h,
          id: `${id}-${h.id}`,
        }))
      : [];

    const hasDynamicWidth = config.minWidth && config.maxWidth;

    const baseNodeContent = (
      <BaseNode
        id={id}
        data={data}
        title={config.title}
        subtitle={config.subtitle}
        icon={config.icon}
        color={config.color}
        width={hasDynamicWidth ? config.minWidth : config.width} // Use minWidth as initial width
        minWidth={config.minWidth}
        maxWidth={config.maxWidth}
        handles={handles}
      >
        {config.fields
          .filter((f) => f.variableHandlers)
          .map((field) => (
            <DynamicHandleGenerator
              key={field.name}
              nodeId={id}
              text={state[field.name]}
            />
          ))}
        <div className="flex flex-col gap-3">
          {config.fields.map((field, index) => {
            if (field.type === "textDisplay") {
              return (
                <span key={index} className="text-sm text-neutral-600">
                  {field.content}
                </span>
              );
            }

            if (field.type === "llmField") {
              return (
                <label key={field.name} className="flex flex-col gap-1">
                  {field.label && (
                    <span className="text-xs font-medium text-neutral-600">
                      {field.label}
                    </span>
                  )}
                  <LLMFieldWithConnection
                    nodeId={id}
                    fieldName={field.name}
                    placeholder={field.placeholder}
                    value={state[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  />
                </label>
              );
            }

            if (field.type === "text") {
              return (
                <label key={field.name} className="flex flex-col gap-1">
                  {field.label && (
                    <span className="text-xs font-medium text-neutral-600">
                      {field.label}
                    </span>
                  )}
                  <input
                    type="text"
                    value={state[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="px-2.5 py-1.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </label>
              );
            }

            if (field.type === "number") {
              return (
                <label key={field.name} className="flex flex-col gap-1">
                  {field.label && (
                    <span className="text-xs font-medium text-neutral-600">
                      {field.label}
                    </span>
                  )}
                  <input
                    type="number"
                    value={state[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="px-2.5 py-1.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </label>
              );
            }

            if (field.type === "select") {
              return (
                <label key={field.name} className="flex flex-col gap-1">
                  {field.label && (
                    <span className="text-xs font-medium text-neutral-600">
                      {field.label}
                    </span>
                  )}
                  <select
                    value={state[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="px-2.5 py-1.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                  >
                    {/* Handle defaults if state is empty */}
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            if (field.type === "textarea") {
              const variables = extractVariables(state[field.name] || "");

              return (
                <div key={field.name} className="flex flex-col gap-2">
                  <div className="relative">
                    <label className="flex flex-col gap-1">
                      {field.label && (
                        <span className="text-xs font-medium text-neutral-600">
                          {field.label}
                        </span>
                      )}

                      <AutoResizeTextarea
                        value={state[field.name]}
                        onChange={(e) =>
                          field.enableAutocomplete
                            ? handleTextChange(e, field.name)
                            : handleChange(field.name, e.target.value)
                        }
                        onBlur={() =>
                          setTimeout(() => setShowAutocomplete(false), 200)
                        }
                        placeholder={field.placeholder}
                      />
                    </label>

                    {field.enableAutocomplete &&
                      showAutocomplete &&
                      activeFieldName === field.name && (
                        <VariableAutocomplete
                          options={availableInputNodes.map((n) => ({
                            value: n.data?.inputName || n.id,
                          }))}
                          onSelect={insertVariable}
                        />
                      )}
                  </div>

                  {/* Variable chips section */}
                  {field.variableHandlers && variables.length > 0 && (
                    <div className="pt-2 border-t border-neutral-200">
                      <div className="text-xs font-medium text-neutral-500 mb-2">
                        Variables:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {variables.map((variable) => (
                          <VariableChip
                            key={variable}
                            variable={variable}
                            onRemove={() =>
                              handleRemoveVariable(field.name, variable)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>
      </BaseNode>
    );

    if (hasDynamicWidth) {
      return (
        <DynamicWidthContainer
          minWidth={config.minWidth}
          maxWidth={config.maxWidth}
        >
          {baseNodeContent}
        </DynamicWidthContainer>
      );
    }

    return baseNodeContent;
  };
};
