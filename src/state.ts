import {
  applyEdgeChanges,
  applyNodeChanges,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeTypes,
} from "@xyflow/react";
import { customAlphabet, nanoid } from "nanoid";
import { createWithEqualityFn } from "zustand/traditional";
import Number from "./node-editor/nodes/Number";
import { ShaderOutput } from "./node-editor/nodes/Output";
import String from "./node-editor/nodes/String";
import Math from "./node-editor/nodes/Math";
import Vec2 from "./node-editor/nodes/Vec2";
import { Vec3 } from "./node-editor/nodes/Vec3";
import { Vec4 } from "./node-editor/nodes/Vec4";

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

const idGen = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10,
);

export const useStore = createWithEqualityFn<StoreState>((set, get) => ({
  nodes: [] as Node[],
  edges: [] as Edge[],
  nodeTypes: {
    shaderOutput: ShaderOutput,
    number: Number,
    string: String,
    math: Math,
    vec2: Vec2,
    vec3: Vec3,
    vec4: Vec4,
  },

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
    const id = idGen();
    const position = { x: 0, y: 0 };

    switch (type) {
      case "number": {
        const data = { value: 0 };
        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
      case "string": {
        const data = { value: "" };
        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
      case "shaderOutput": {
        const data = { value: "" };
        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
      case "math": {
        const data = { operation: "+" };
        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
      case "vec2": {
        const data = { x: 0, y: 0 };
        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
      case "vec3": {
        const data = { r: 0, g: 0, b: 0 };
        set({ nodes: [...get().nodes, { id, type, data, position }] });
        break;
      }
      case "vec4": {
        const data = { r: "0.0", g: "0.0", b: "0.0", a: "0.0" };
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
