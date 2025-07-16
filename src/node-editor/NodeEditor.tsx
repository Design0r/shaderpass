import { type JSX } from "react";
import { ReactFlow, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useStore, type StoreState } from "./state";
import { shallow } from "zustand/shallow";
import { NodePanel } from "./components/Panel";

const selector = (selector: StoreState) => ({
  nodes: selector.nodes,
  edges: selector.edges,
  onNodesChange: selector.onNodesChange,
  onEdgesChange: selector.onEdgesChange,
  onConnect: selector.addEdge,
  nodeTypes: selector.nodeTypes,
});

export function NodeEditor(): JSX.Element {
  const store = useStore(selector, shallow);

  return (
    <ReactFlow
      nodes={store.nodes}
      edges={store.edges}
      onNodesChange={store.onNodesChange}
      onEdgesChange={store.onEdgesChange}
      onConnect={store.onConnect}
      nodeTypes={store.nodeTypes}
      fitView
    >
      <NodePanel />
      <Background />
    </ReactFlow>
  );
}
