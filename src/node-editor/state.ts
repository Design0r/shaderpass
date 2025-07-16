import {
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type NodeTypes,
} from "@xyflow/react";
import { nanoid } from "nanoid";
import { createWithEqualityFn } from "zustand/traditional";
import Number from "./nodes/constants/Number";
import { Output } from "./nodes/Output";

export interface StoreState {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: NodeTypes;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  addEdge: (data: Omit<Edge, "id">) => void;
  updateNode: (id: Node["id"], data: Partial<Node["data"]>) => void;
  createNode: (type: string) => void;
}

export const useStore = createWithEqualityFn<StoreState>((set, get) => ({
  nodes: [] as Node[],
  edges: [] as Edge[],
  nodeTypes: { output: Output, number: Number },

  onNodesChange(changes) {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange(changes) {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addEdge(data) {
    const id = nanoid(6);
    const edge: Edge = { id, ...data };
    set({ edges: [edge, ...get().edges] });
  },

  updateNode(id, data) {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: { ...node.data, ...data },
            }
          : node,
      ),
    });
  },

  createNode(type: string) {
    const id = nanoid();
    const position = { x: 0, y: 0 };

    switch (type) {
      case "number": {
        const data = { value: 0 };
        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
    }
  },
}));
