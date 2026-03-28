// nodesConfig.js
import { Position } from "reactflow";

import { SiOpenai } from "react-icons/si";

import {
  MdApi,
  MdOutlineEmail,
  MdFilterList,
  MdInput,
  MdOutlineTransform,
  MdOutput,
  MdTextFields,
  MdTimer,
} from "react-icons/md";

export const nodeConfigs = {
  customInput: {
    title: "Input",
    icon: MdInput,
    color: "input", // Uses input color scheme from tailwind.config.js
    handles: [{ type: "source", position: Position.Right, id: "value" }],
    fields: [
      {
        label: "Input Name",
        type: "text",
        name: "inputName",
      },
      {
        label: "Input Type",
        type: "select",
        name: "inputType",
        options: [
          { value: "Text", label: "Text" },
          { value: "File", label: "File" },
        ],
      },
    ],
  },
  text: {
    title: "Text",
    icon: MdTextFields,
    color: "text", // Uses text color scheme
    minWidth: 280, // Start at standard width
    maxWidth: 430, // Expand up to 400px as content grows
    handles: [{ type: "source", position: Position.Right, id: "output" }],
    fields: [
      {
        label: "Text Content",
        type: "textarea",
        name: "text",
        placeholder: "Hello, welcome to our platform!",
        autoResize: true,
        enableAutocomplete: true,
        variableHandlers: true,
      },
    ],
  },
  llm: {
    title: "LLM",
    icon: SiOpenai,
    color: "llm", // Uses llm color scheme
    handles: [
      {
        type: "target",
        position: Position.Left,
        id: "system",
        label: "system",
        style: { top: `${100 / 3}%` },
      },
      {
        type: "target",
        position: Position.Left,
        id: "prompt",
        label: "prompt",
        style: { top: `${200 / 3}%` },
      },
      { type: "source", position: Position.Right, id: "response" },
    ],
    fields: [
      {
        label: "System",
        type: "llmField",
        name: "system",
        placeholder: "Enter system prompt...",
      },
      {
        label: "Prompt",
        type: "llmField",
        name: "prompt",
        placeholder: "Enter your prompt...",
      },
      {
        label: "Model",
        type: "select",
        name: "model",
        options: [
          { value: "GPT-5", label: "GPT-5" },
          { value: "GPT-4", label: "GPT-4" },
          { value: "Claude Sonnet 4.5", label: "Claude Sonnet 4.5" },
          { value: "Gemini 3 Pro", label: "Gemini 3 Pro" },
          { value: "Gemini 3 Flash", label: "Gemini 3 Flash" },
        ],
      },
    ],
  },
  email: {
    title: "Email",
    icon: MdOutlineEmail,
    color: "email", // Uses email color scheme
    handles: [
      { type: "target", position: Position.Left, id: "input" },
      { type: "source", position: Position.Right, id: "output" },
    ],
    fields: [
      {
        label: "To Email",
        type: "text",
        name: "email",
        placeholder: "user@example.com",
      },
      {
        label: "Subject",
        type: "text",
        name: "subject",
        placeholder: "New Message",
      },
      {
        label: "Email Template",
        type: "select",
        name: "template",
        options: [
          { value: "Plain Text", label: "Plain Text" },
          { value: "HTML", label: "HTML" },
        ],
      },
      {
        label: "Priority",
        type: "select",
        name: "priority",
        options: [
          { value: "Normal", label: "Normal" },
          { value: "High", label: "High" },
          { value: "Low", label: "Low" },
        ],
      },
    ],
  },
  api: {
    title: "API Request",
    icon: MdApi,
    color: "neutral",
    handles: [
      { type: "target", position: Position.Left, id: "trigger" },
      { type: "source", position: Position.Right, id: "response" },
    ],
    fields: [
      {
        label: "API URL",
        type: "text",
        name: "url",
        placeholder: "https://api.example.com",
      },
      {
        label: "HTTP Method",
        type: "select",
        name: "method",
        options: [
          { value: "GET", label: "GET" },
          { value: "POST", label: "POST" },
          { value: "PUT", label: "PUT" },
          { value: "DELETE", label: "DELETE" },
        ],
      },
      {
        label: "Headers (JSON)",
        type: "textarea",
        name: "headers",
        placeholder: '{"Content-Type": "application/json"}',
      },
      {
        label: "Timeout (seconds)",
        type: "number",
        name: "timeout",
      },
    ],
  },
  delay: {
    title: "Delay",
    icon: MdTimer,
    color: "neutral",
    handles: [
      { type: "target", position: Position.Left, id: "input" },
      { type: "source", position: Position.Right, id: "output" },
    ],
    fields: [
      {
        label: "Delay Duration",
        type: "number",
        name: "delay",
      },
      {
        label: "Time Unit",
        type: "select",
        name: "unit",
        options: [
          { value: "Seconds", label: "Seconds" },
          { value: "Minutes", label: "Minutes" },
          { value: "Hours", label: "Hours" },
        ],
      },
    ],
  },
  filter: {
    title: "Filter",
    icon: MdFilterList,
    color: "neutral",
    handles: [
      { type: "target", position: Position.Left, id: "input" },
      {
        type: "source",
        position: Position.Right,
        id: "yes",
        label: "YES",
        style: { top: "30%" },
      },
      {
        type: "source",
        position: Position.Right,
        id: "no",
        label: "NO",
        style: { top: "70%" },
      },
    ],
    fields: [
      {
        label: "Condition",
        type: "select",
        name: "filterCondition",
        options: [
          { value: "Contains", label: "Contains" },
          { value: "Equals", label: "Equals" },
          { value: "Starts With", label: "Starts With" },
        ],
      },
      {
        label: "Value",
        type: "text",
        name: "value",
      },
    ],
  },

  output: {
    title: "Output",
    icon: MdOutput,
    color: "neutral",
    handles: [{ type: "target", position: Position.Left, id: "value" }],
    fields: [
      {
        label: "Output Name",
        type: "text",
        name: "outputName",
      },
      {
        label: "Output Type",
        type: "select",
        name: "outputType",
        options: [
          { value: "Text", label: "Text" },
          { value: "File", label: "Image" },
        ],
      },
    ],
  },
  transform: {
    title: "Transform",
    icon: MdOutlineTransform,
    color: "neutral",
    handles: [
      { type: "target", position: Position.Left, id: "input" },
      { type: "source", position: Position.Right, id: "output" },
    ],
    fields: [
      {
        label: "Type",
        type: "select",
        name: "transformType",
        options: [
          { value: "Upper Case", label: "Upper Case" },
          { value: "Lower Case", label: "Lower Case" },
          { value: "Stringify", label: "Stringify" },
        ],
      },
    ],
  },
};
