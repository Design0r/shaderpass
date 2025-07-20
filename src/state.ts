import {
  applyEdgeChanges,
  applyNodeChanges,
  reconnectEdge as rfReconnectEdge,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeProps,
} from "@xyflow/react";
import { customAlphabet, nanoid } from "nanoid";
import { createWithEqualityFn } from "zustand/traditional";
import { NumberNode } from "./nodes/Number";
import { ShaderOutput } from "./nodes/Output";
import { Math } from "./nodes/Math";
import { Vec2, Vec3, Vec4 } from "./nodes/Vec";
import { Noise2D } from "./nodes/Noise2D";
import { TimeNode } from "./nodes/Time";
import type { ComponentType } from "react";

export type ShaderPassNodes = Record<string, ShaderPassCategory>;

export interface ShaderPassCategory {
  color: string;
  label: string;
  nodes: ShaderPassNode[];
}

export interface ShaderPassNode {
  name: string;
  label: string;
  node: ComponentType<
    NodeProps & {
      data: any;
      type: any;
    }
  >;
}

export interface StoreState {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: ShaderPassNodes;
  selectedNode: Node | undefined;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  reconnectEdge: (oldEdge: Edge, connection: Connection) => void;
  addEdge: (data: Omit<Edge, "id">) => void;
  removeEdge: (id: Edge["id"]) => void;
  updateNode: (id: Node["id"], data: Partial<Node["data"]>) => void;
  createNode: (type: string) => void;
  selectNode: (id: Node["id"]) => void;
  deselectNode: () => void;
}

const idGen = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10,
);

export const useStore = createWithEqualityFn<StoreState>((set, get) => ({
  nodes: [] as Node[],
  edges: [] as Edge[],
  nodeTypes: {
    values: {
      color: "#afa",
      label: "Values",
      nodes: [
        { name: "float", label: "Float", node: NumberNode },
        { name: "vec2", label: "Vec2", node: Vec2 },
        { name: "vec3", label: "Vec3", node: Vec3 },
        { name: "vec4", label: "Vec4", node: Vec4 },
      ],
    },
    materials: {
      color: "#aaf",
      label: "Materials",
      nodes: [
        { name: "basicMtl", label: "Basic Material", node: ShaderOutput },
      ],
    },
    math: {
      color: "#faa",
      label: "Math",
      nodes: [{ name: "mathOp", label: "Math Op", node: Math }],
    },
    noise: {
      color: "#999",
      label: "Noise",
      nodes: [{ name: "noise2d", label: "Noise 2D", node: Noise2D }],
    },
    inputs: {
      color: "#fff",
      label: "Inputs",
      nodes: [{ name: "time", label: "Time", node: TimeNode }],
    },
  },

  selectedNode: undefined,

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

  reconnectEdge(oldEdge, connection) {
    set({
      edges: rfReconnectEdge(oldEdge, connection, get().edges),
    });
  },

  addEdge(data) {
    const id = nanoid(6);
    const edge: Edge = { id, ...data };
    set({ edges: [edge, ...get().edges] });
  },

  removeEdge(id) {
    set({
      edges: get().edges.filter((e) => e.id !== id),
    });
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

  selectNode(id) {
    set({ selectedNode: get().nodes.find((n) => n.id === id) });
  },

  deselectNode() {
    set({ selectedNode: undefined });
  },

  createNode(type: string) {
    const id = idGen();
    const position = { x: 0, y: 0 };

    switch (type) {
      case "float": {
        const data = { name: "Float", value: "0.0" };
        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
      case "basicMtl": {
        const data = { name: "Basic Material", value: "" };
        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
      case "mathOp": {
        const data = { name: "Math Op", operation: "+" };
        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
      case "vec2": {
        const data = { name: "Vec2", x: 0, y: 0 };
        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
      case "vec3": {
        const data = { name: "Vec3", r: 0, g: 0, b: 0 };
        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
      case "vec4": {
        const data = { name: "Vec4", r: "0.0", g: "0.0", b: "0.0", a: "1.0" };
        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
      case "noise2d": {
        const data = { name: "Noise2D", frequency: "1.0", time: "0.0" };
        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
      case "time": {
        const data = { name: "Time" };
        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
    }
  },
}));

export interface SerializedState {
  nodes: Node[];
  edges: Edge[];
}

export function serializeState(): SerializedState {
  const store = useStore.getState();
  return { nodes: store.nodes, edges: store.edges };
}
