import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  reconnectEdge,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useRef, type JSX, type ReactElement } from "react";
import { shallow } from "zustand/shallow";
import { ShaderGenerator } from "../shader/shaderGenerator";
import { loadTemplate } from "../shader/templateLoader";
import { useStore, type StoreState } from "../state";
import type { NodeData } from "../types/nodeData";

const selector = (store: StoreState) => ({
  nodes: store.nodes,
  edges: store.edges,
  setData: store.setData,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  onConnect: store.addEdge,
  nodeTypes: Object.fromEntries(
    Object.values(store.nodeTypes).flatMap((cat) =>
      cat.nodes.map(({ name, node }) => [name, node] as const),
    ),
  ) as Record<string, React.ComponentType<any>>,
  selectNode: store.selectNode,
  reconnectEdge: store.reconnectEdge,
  removeEdge: store.removeEdge,
});

export function NodeEditor({
  children,
}: {
  children?: ReactElement | ReactElement[] | undefined;
}): JSX.Element {
  const store = useStore(selector, shallow);
  const edgeReconnectSuccessful = useRef(true);

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge: any, connection: Connection) => {
      edgeReconnectSuccessful.current = true;
      store.reconnectEdge(oldEdge, connection);
    },
    [reconnectEdge],
  );

  const onReconnectEnd = useCallback(
    (_: any, edge: any) => {
      if (!edgeReconnectSuccessful.current) {
        store.removeEdge(edge.id);
      }
      edgeReconnectSuccessful.current = true;
    },
    [store.removeEdge],
  );

  return (
    <ReactFlow
      colorMode="dark"
      nodes={store.nodes}
      edges={store.edges}
      onNodesChange={store.onNodesChange}
      onEdgesChange={store.onEdgesChange}
      onReconnectStart={onReconnectStart}
      onReconnect={onReconnect}
      onReconnectEnd={onReconnectEnd}
      onConnect={store.onConnect}
      nodeTypes={store.nodeTypes}
      proOptions={{ hideAttribution: true }}
      onNodeClick={(_, n) => store.selectNode(n.id)}
      onPaneClick={() => store.selectNode("")}
      fitView
    >
      <Panel className="space-x-2" position="top-left">
        <button
          className="btn btn-primary"
          onClick={() => {
            const s = new ShaderGenerator(
              store.nodes as NodeData[],
              store.edges,
            );
            const result = s.generate();
            const data = {
              MATERIAL_NAME: "MyMaterial",
              SHADER_NAME: "MyShader",
              SHADER_NAME_LOWER: "myShader",
              UNIFORMS: "",
              FRAGMENT_SHADER: result.fragment,
              VERTEX_SHADER: result.vertex,
            };
            const template = loadTemplate(data);
            navigator.clipboard.writeText(template);
          }}
        >
          Export
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            const data = { nodes: store.nodes, edges: store.edges };
            const stringify = JSON.stringify(data);
            localStorage.setItem("scene", stringify);
          }}
        >
          Save
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            const storage = localStorage.getItem("scene");
            if (!storage) return;
            const data = JSON.parse(storage);
            console.log(data);
            store.setData(data.nodes, data.edges);
          }}
        >
          Load
        </button>
      </Panel>
      <Controls />
      <MiniMap />
      {children}
      <Background color="#222" gap={40} variant={BackgroundVariant.Lines} />
    </ReactFlow>
  );
}
