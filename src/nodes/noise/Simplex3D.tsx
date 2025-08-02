import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { LimitHandle } from "../../handles/Handle";
import { useStore, type StoreState } from "../../state";
import { BaseNode } from "../BaseNode";

export interface Simplex3DData {
  name: string;
}

export interface Simplex3DProps {
  id: string;
  data: Simplex3DData;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
  nodeColor: store.nodeTypes.noise.color,
});

export function Simplex3D({ id }: Simplex3DProps): JSX.Element {
  const { isSelected, nodeColor } = useStore(selector(id), shallow);

  return (
    <BaseNode isSelected={isSelected} name="Simplex3D" accentColor={nodeColor}>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span>Vec3</span>
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
      <Handle id="out" type="source" position={Position.Right} />
    </BaseNode>
  );
}
