import { Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { LimitHandle, StyledHandle } from "../../handles/Handle";
import { useStore, type StoreState } from "../../state";
import { BaseNode } from "../BaseNode";

export interface Simplex2DData {
  name: string;
}

export interface Simplex2DProps {
  id: string;
  data: Simplex2DData;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
  nodeColor: store.nodeTypes.noise.color,
});

export function Simplex2D({ id, data }: Simplex2DProps): JSX.Element {
  const { isSelected, nodeColor } = useStore(selector(id), shallow);

  return (
    <BaseNode isSelected={isSelected} name={data.name} accentColor={nodeColor}>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span>Vec2</span>
        </div>
        <div>
          <span>Out</span>
        </div>
      </div>
      <LimitHandle
        id="input"
        style={{ top: "50%" }}
        type="target"
        position={Position.Left}
        connectionCount={1}
      />
      <StyledHandle id="out" type="source" position={Position.Right} />
    </BaseNode>
  );
}
