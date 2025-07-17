import { Handle, Position } from "@xyflow/react";
import type { ChangeEvent, JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "./BaseNode";

export interface Vec2Data {
  x: number;
  y: number;
}

export interface Vec2Props {
  id: string;
  data: Vec2Data;
}

const selector = (id: string) => (store: StoreState) => ({
  setX: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { x: parseFloat(e.target.value) }),
  setY: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { y: parseFloat(e.target.value) }),
});

export function Vec2({ id, data }: Vec2Props): JSX.Element {
  const { setX, setY } = useStore(selector(id), shallow);

  return (
    <BaseNode name="Vec2" accentColor="bg-gray-400">
      <div className="flex flex-col">
        <label className="flex items-center">
          <span className="pr-2">x</span>
          <input
            className="nodrag input"
            type="number"
            value={data.x}
            onChange={setX}
          />
        </label>

        <label className="flex items-center">
          <span className="pr-2">y</span>
          <input
            className="nodrag input"
            type="number"
            value={data.y}
            onChange={setY}
          />
        </label>
      </div>

      <Handle
        id="x"
        style={{ top: "50%" }}
        type="target"
        position={Position.Left}
      />
      <Handle
        id="y"
        style={{ top: "80%" }}
        type="target"
        position={Position.Left}
      />
      <Handle id="out" type="source" position={Position.Right} />
    </BaseNode>
  );
}

export default Vec2;
