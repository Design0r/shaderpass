import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "../BaseNode";
import { LimitHandle } from "../../handles/Handle";

export interface FloorData {
  name: string;
}

export interface FloorProps {
  id: string;
  data: FloorData;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
  nodeColor: store.nodeTypes.math.color,
});

export function Floor({ id, data }: FloorProps): JSX.Element {
  const { isSelected, nodeColor } = useStore(selector(id), shallow);

  return (
    <BaseNode isSelected={isSelected} name={data.name} accentColor={nodeColor}>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span>In</span>
        </div>
        <div className="items-center">
          <span>Out</span>
        </div>
      </div>

      <LimitHandle
        style={{ top: "60%" }}
        id={"input"}
        type="target"
        position={Position.Left}
        connectionCount={1}
      />
      <Handle id={"out"} type="source" position={Position.Right} />
    </BaseNode>
  );
}
