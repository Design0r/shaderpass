import { Background, Controls, MiniMap, Panel, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { type JSX } from "react";
import { shallow } from "zustand/shallow";
import { NodePanel } from "./components/Panel";
import { serializeState, useStore, type StoreState } from "../state";
import { ShaderGenerator } from "../threejs/ast";

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
      <Panel position="top-left">
        <button
          className="btn btn-primary"
          onClick={() => {
            console.log(serializeState());
          }}
        >
          Export
        </button>
        <button
          className="btn btn-error"
          onClick={() => {
            const s = new ShaderGenerator(store.nodes, store.edges).generate();
            console.log(s.vertex);
            console.log(s.fragment);
          }}
        >
          Generate
        </button>
      </Panel>
      <NodePanel />
      <Controls />
      <MiniMap />
      <Background />
    </ReactFlow>
  );
}
