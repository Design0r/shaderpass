import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../state";
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
  isSelected: store.selectedNode?.id === id,
});

export function Vec2({ id }: Vec2Props): JSX.Element {
  const { isSelected } = useStore(selector(id), shallow);

  return (
    <BaseNode isSelected={isSelected} name="Vec2" accentColor="bg-gray-400">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span>X</span>
          <span>Y</span>
        </div>
        <div>
          <span>Out</span>
        </div>
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
