import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "../BaseNode";

export interface Noise2DData {
  name: string;
  frequency: number;
  time: number;
}

export interface Noise2DProps {
  id: string;
  data: Noise2DData;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
  nodeColor: store.nodeTypes.noise.color,
});

export function Noise2D({ id }: Noise2DProps): JSX.Element {
  const { isSelected, nodeColor } = useStore(selector(id), shallow);

  return (
    <BaseNode isSelected={isSelected} name="Noise2D" accentColor={nodeColor}>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span>Freq</span>
          <span>Time</span>
        </div>
        <div>
          <span>Out</span>
        </div>
      </div>
      <Handle
        id="freq"
        style={{ top: "53%" }}
        type="target"
        position={Position.Left}
      />
      <Handle
        id="time"
        style={{ top: "78%" }}
        type="target"
        position={Position.Left}
      />
      <Handle id="out" type="source" position={Position.Right} />
    </BaseNode>
  );
}
