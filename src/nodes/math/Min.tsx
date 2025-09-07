import { Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "../BaseNode";
import { LimitHandle, StyledHandle } from "../../handles/Handle";

export interface MinData {
  name: string;
}

export interface MinProps {
  id: string;
  data: MinData;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
  nodeColor: store.nodeTypes.math.color,
});

export function Min({ id, data }: MinProps): JSX.Element {
  const { isSelected, nodeColor } = useStore(selector(id), shallow);

  return (
    <BaseNode isSelected={isSelected} name={data.name} accentColor={nodeColor}>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span>A</span>
          <span>B</span>
        </div>
        <div className="items-center">
          <span>Out</span>
        </div>
      </div>

      <LimitHandle
        style={{ top: "54%" }}
        id={"inputA"}
        type="target"
        position={Position.Left}
        connectionCount={1}
      />
      <LimitHandle
        style={{ top: "78%" }}
        id={"inputB"}
        type="target"
        position={Position.Left}
        connectionCount={1}
      />
      <StyledHandle id={"out"} type="source" position={Position.Right} />
    </BaseNode>
  );
}
