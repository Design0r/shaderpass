import { Panel } from "@xyflow/react";
import type { JSX } from "react";
import { useStore, type StoreState } from "../state";
import { shallow } from "zustand/shallow";

const selector = (store: StoreState) => ({
  createNode: store.createNode,
  nodeTypes: store.nodeTypes,
});

export function NodePanel(): JSX.Element {
  const store = useStore(selector, shallow);
  return (
    <Panel position="top-right">
      {Object.entries(store.nodeTypes).map(([k, _]) => (
        <button
          className="btn bg-base-100 text-white"
          onClick={() => store.createNode(k)}
        >
          {k.charAt(0).toUpperCase() + k.slice(1)}
        </button>
      ))}
    </Panel>
  );
}
