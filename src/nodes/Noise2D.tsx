import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../state";
import { BaseNode } from "./BaseNode";

export interface Noise2DData {
  name: string;
  frequency: number;
}

export interface Noise2DProps {
  id: string;
  data: Noise2DData;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
});

export function Noise2D({ id }: Noise2DProps): JSX.Element {
  const { isSelected } = useStore(selector(id), shallow);

  return (
    <BaseNode isSelected={isSelected} name="Noise2D" accentColor="bg-gray-400">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span>Freq</span>
        </div>
        <div>
          <span>Out</span>
        </div>
      </div>
      <Handle
        id="freq"
        style={{ top: "73%" }}
        type="target"
        position={Position.Left}
      />
      <Handle id="out" type="source" position={Position.Right} />
    </BaseNode>
  );
}
