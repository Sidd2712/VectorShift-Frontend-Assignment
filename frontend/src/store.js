// store.js
import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {}, // Add missing nodeIDs state
  clickedEdges: {}, // Track which edges are clicked (for color change)

  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  // Direct setters for ReactFlow integration
  setNodes: (nodes) => {
    if (typeof nodes === "function") {
      set((state) => ({ nodes: nodes(state.nodes) }));
    } else {
      set({ nodes });
    }
  },

  setEdges: (edges) => {
    if (typeof edges === "function") {
      set((state) => ({ edges: edges(state.edges) }));
    } else {
      set({ edges });
    }
  },

  // Keep these for backward compatibility but mark them as deprecated
  // These should NOT be used directly in ReactFlow event handlers
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: "customEdge",
          animated: true,
          markerEnd: {
            type: MarkerType.Arrow,
            height: "20px",
            width: "20px",
          },
        },
        get().edges
      ),
    });
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }

        return node;
      }),
    });
  },

  // Additional utility methods
  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
    })),

  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
    })),

  removeEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
      clickedEdges: Object.fromEntries(
        Object.entries(state.clickedEdges).filter(([edgeId]) => edgeId !== id)
      ),
    })),

  // Edge click state management
  setEdgeClicked: (edgeId, clicked) =>
    set((state) => ({
      clickedEdges: clicked
        ? { ...state.clickedEdges, [edgeId]: true }
        : Object.fromEntries(
            Object.entries(state.clickedEdges).filter(([id]) => id !== edgeId)
          ),
    })),
}));
