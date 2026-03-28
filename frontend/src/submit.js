// submit.js
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import toast from "react-hot-toast";

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  const handleSubmit = async () => {
    // Check if playground is empty
    if (nodes.length === 0 && edges.length === 0) {
      toast.error(
        (t) => (
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              Playground is empty. Add nodes to create a pipeline.
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        ),
        {
          duration: 3500,
          position: "top-right",
          style: {
            background: "#ffffff",
            color: "#1f2937",
            border: "1px solid #fee2e2",
            borderLeft: "4px solid #ef4444",
            padding: "14px 18px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow:
              "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
            maxWidth: "380px",
          },
          icon: "⚠️",
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        }
      );
      return; // Don't call the API
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/pipelines/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nodes, edges }),
      });

      const data = await response.json();

      // Show success toast with DAG details
      if (data.is_dag) {
        toast.success(
          (t) => (
            <div className="flex gap-3">
              <div className="flex flex-col gap-2.5 flex-1">
                <div className="font-semibold text-gray-900 text-[15px]">
                  Valid DAG
                </div>
                <div className="flex gap-4 text-[13px] text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <span className="text-gray-400">Nodes</span>
                    <span className="font-medium text-gray-900">
                      {data.num_nodes}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-gray-400">Edges</span>
                    <span className="font-medium text-gray-900">
                      {data.num_edges}
                    </span>
                  </span>
                </div>
                <div className="text-[12px] text-emerald-600 font-medium">
                  Pipeline is a directed acyclic graph
                </div>
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 self-start"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ),
          {
            duration: 5000,
            position: "top-right",
            style: {
              background: "#ffffff",
              color: "#1f2937",
              border: "1px solid #d1fae5",
              borderLeft: "4px solid #10b981",
              padding: "16px 18px",
              borderRadius: "8px",
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
              maxWidth: "380px",
            },
          }
        );
      } else {
        toast.error(
          (t) => (
            <div className="flex gap-3">
              <div className="flex flex-col gap-2.5 flex-1">
                <div className="font-semibold text-gray-900 text-[15px]">
                  Not a DAG
                </div>
                <div className="flex gap-4 text-[13px] text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <span className="text-gray-400">Nodes</span>
                    <span className="font-medium text-gray-900">
                      {data.num_nodes}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-gray-400">Edges</span>
                    <span className="font-medium text-gray-900">
                      {data.num_edges}
                    </span>
                  </span>
                </div>
                <div className="text-[12px] text-red-600 font-medium">
                  Pipeline contains cycles or is not directed
                </div>
              </div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 self-start"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ),
          {
            duration: 5000,
            position: "top-right",
            style: {
              background: "#ffffff",
              color: "#1f2937",
              border: "1px solid #fee2e2",
              borderLeft: "4px solid #ef4444",
              padding: "16px 18px",
              borderRadius: "8px",
              boxShadow:
                "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
              maxWidth: "380px",
            },
          }
        );
      }
    } catch (error) {
      console.error("Error submitting pipeline:", error);
      toast.error(
        (t) => (
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              Failed to submit pipeline. Check your connection and try again.
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        ),
        {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#ffffff",
            color: "#1f2937",
            border: "1px solid #fee2e2",
            borderLeft: "4px solid #dc2626",
            padding: "14px 18px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow:
              "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
            maxWidth: "380px",
          },
          icon: "⚠️",
          iconTheme: {
            primary: "#dc2626",
            secondary: "#ffffff",
          },
        }
      );
    }
  };

  return (
    <div className="flex items-center justify-center fixed top-5 right-5 z-[1000]">
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
        onClick={handleSubmit}
      >
        Submit Pipeline
      </button>
    </div>
  );
};
