import { Background, Controls, MiniMap, Panel, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { type JSX, type ReactElement } from "react";
import { shallow } from "zustand/shallow";
import { NodePanel } from "./Panel";
import { serializeState, useStore, type StoreState } from "../state";
import { ShaderGenerator } from "../shader/ast";

const selector = (selector: StoreState) => ({
  nodes: selector.nodes,
  edges: selector.edges,
  onNodesChange: selector.onNodesChange,
  onEdgesChange: selector.onEdgesChange,
  onConnect: selector.addEdge,
  nodeTypes: selector.nodeTypes,
  selectNode: selector.selectNode,
});

export function NodeEditor({
  children,
}: {
  children?: ReactElement | ReactElement[] | undefined;
}): JSX.Element {
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
      onNodeClick={(_, n) => store.selectNode(n.id)}
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
      <Controls />
      <MiniMap />
      {children}
      <Background />
    </ReactFlow>
  );
}
