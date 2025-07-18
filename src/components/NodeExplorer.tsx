import type { JSX } from "react";
import { shallow } from "zustand/shallow";
import { useStore, type StoreState } from "../state";

const selector = (store: StoreState) => ({
  createNode: store.createNode,
  nodeTypes: store.nodeTypes,
});

export function NodeExplorer(): JSX.Element {
  const store = useStore(selector, shallow);
  return (
    <div className="flex flex-col">
      {Object.entries(store.nodeTypes).map(([k, _], idx) => (
        <button
          key={idx}
          className="btn bg-base-100 text-white"
          onClick={() => store.createNode(k)}
        >
          {k.charAt(0).toUpperCase() + k.slice(1)}
        </button>
      ))}
    </div>
  );
}
