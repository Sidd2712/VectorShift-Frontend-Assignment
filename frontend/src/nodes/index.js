// index.js
import { createNode } from "./nodeCreator";
import { nodeConfigs } from "./nodesConfig";

export { BaseNode } from "../components/BaseNode";

export const InputNode = createNode(nodeConfigs.customInput);
export const TextNode = createNode(nodeConfigs.text);
export const LLMNode = createNode(nodeConfigs.llm);
export const OutputNode = createNode(nodeConfigs.output);

export const APINode = createNode(nodeConfigs.api);
export const DelayNode = createNode(nodeConfigs.delay);
export const EmailNode = createNode(nodeConfigs.email);
export const FilterNode = createNode(nodeConfigs.filter);
export const TransformNode = createNode(nodeConfigs.transform);
