import { Handle, Position } from "@xyflow/react";
import type { ChangeEvent, JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "./BaseNode";

export interface Vec4Data {
  r: string;
  g: string;
  b: string;
  a: string;
}

export interface Vec4Props {
  id: string;
  data: Vec4Data;
}

const selector = (id: string) => (store: StoreState) => ({
  setR: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { r: e.target.value }),
  setG: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { g: e.target.value }),
  setB: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { b: e.target.value }),
  setA: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { a: e.target.value }),
});

export function Vec4({ id, data }: Vec4Props): JSX.Element {
  const { setR, setG, setB, setA } = useStore(selector(id), shallow);

  return (
    <BaseNode name="Vec4" accentColor="bg-gray-400">
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

        <label className="flex items-center">
          <span className="pr-2">a</span>
          <input
            className="nodrag input"
            type="number"
            value={data.a}
            onChange={setA}
          />
        </label>
      </div>

      <Handle
        id="r"
        style={{ top: "30%" }}
        type="target"
        position={Position.Left}
      />
      <Handle
        id="g"
        style={{ top: "49%" }}
        type="target"
        position={Position.Left}
      />
      <Handle
        id="b"
        style={{ top: "68%" }}
        type="target"
        position={Position.Left}
      />
      <Handle
        id="a"
        style={{ top: "87%" }}
        type="target"
        position={Position.Left}
      />
      <Handle id="out" type="source" position={Position.Right} />
    </BaseNode>
  );
}
