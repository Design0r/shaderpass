import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { LimitHandle } from "../../handles/Handle";
import { useStore, type StoreState } from "../../state";
import { BaseNode } from "../BaseNode";

export interface Noise2DData {
  name: string;
  frequency: string;
  time: string;
  octaves: string;
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
          <span>Octaves</span>
        </div>
        <div>
          <span>Out</span>
        </div>
      </div>
      <LimitHandle
        id="freq"
        style={{ top: "43%" }}
        type="target"
        position={Position.Left}
        connectionCount={1}
      />
      <LimitHandle
        id="time"
        style={{ top: "63%" }}
        type="target"
        position={Position.Left}
        connectionCount={1}
      />
      <LimitHandle
        id="octaves"
        style={{ top: "83%" }}
        type="target"
        position={Position.Left}
        connectionCount={1}
      />
      <Handle id="out" type="source" position={Position.Right} />
    </BaseNode>
  );
}
