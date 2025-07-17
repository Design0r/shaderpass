import { Background, Controls, MiniMap, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { type JSX } from "react";
import { shallow } from "zustand/shallow";
import { NodePanel } from "./components/Panel";
import { useStore, type StoreState } from "./state";

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
      proOptions={{ hideAttribution: true }}
      fitView
    >
      <NodePanel />
      <Controls />
      <MiniMap />
      <Background />
    </ReactFlow>
  );
}
