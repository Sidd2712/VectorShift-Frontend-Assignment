// toolbar.js

import { DraggableNode } from "./draggableNode";

export const PipelineToolbar = () => {
  return (
    <div className="bg-white px-4 py-3 border-b border-neutral-200 flex gap-3 flex-wrap items-center shadow-sm">
      {/* Original 4 nodes */}
      <DraggableNode type="customInput" label="Input" />
      <DraggableNode type="text" label="Text" />
      <DraggableNode type="llm" label="LLM" />
      <DraggableNode type="customOutput" label="Output" />
      {/* New nodes */}
      <DraggableNode type="api" label="API" />
      <DraggableNode type="delay" label="Delay" />
      <DraggableNode type="filter" label="Filter" />
      <DraggableNode type="transform" label="Transform" />
      <DraggableNode type="email" label="Email" />
    </div>
  );
};
