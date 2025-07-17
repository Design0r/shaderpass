import { Handle, Position } from "@xyflow/react";
import type { ChangeEvent, JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "./BaseNode";

export interface Vec3Data {
  r: number;
  g: number;
  b: number;
}

export interface Vec3Props {
  id: string;
  data: Vec3Data;
}

const selector = (id: string) => (store: StoreState) => ({
  setR: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { r: parseFloat(e.target.value) }),
  setG: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { g: parseFloat(e.target.value) }),
  setB: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { b: parseFloat(e.target.value) }),
});

export function Vec3({ id, data }: Vec3Props): JSX.Element {
  const { setR, setG, setB } = useStore(selector(id), shallow);

  return (
    <BaseNode name="Vec3" accentColor="bg-gray-400">
      <div className="flex flex-col">
        <label className="flex items-center">
          <span className="pr-2">r</span>
          <input
            className="nodrag input"
            type="number"
            value={data.r}
            onChange={setR}
          />
        </label>

        <label className="flex items-center">
          <span className="pr-2">g</span>
          <input
            className="nodrag input"
            type="number"
            value={data.g}
            onChange={setG}
          />
        </label>

        <label className="flex items-center">
          <span className="pr-2">b</span>
          <input
            className="nodrag input"
            type="number"
            value={data.b}
            onChange={setB}
          />
        </label>
      </div>

      <Handle
        id="r"
        style={{ top: "37%" }}
        type="target"
        position={Position.Left}
      />
      <Handle
        id="g"
        style={{ top: "60%" }}
        type="target"
        position={Position.Left}
      />
      <Handle
        id="b"
        style={{ top: "83%" }}
        type="target"
        position={Position.Left}
      />
      <Handle id="out" type="source" position={Position.Right} />
    </BaseNode>
  );
}
