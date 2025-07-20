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
    <div className="flex flex-col space-y-1 px-1">
      {Object.entries(store.nodeTypes).map(([_, cat], idx) => (
        <div
          key={idx}
          style={{ color: cat.color }}
          className="collapse border-base-300 bg-base-100 border shadow-md"
        >
          <input type="checkbox" />
          <div className="collapse-title font-semibold p-3">{cat.label}</div>
          <div className="collapse-content px-1 text-sm space-y-1">
            {cat.nodes.map((n, id) => (
              <button
                key={id + idx}
                style={{ backgroundColor: cat.color }}
                className="btn w-full text-black shadow-lg"
                onClick={() => store.createNode(n.name)}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
