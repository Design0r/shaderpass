import { Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "../BaseNode";
import { StyledHandle } from "../../handles/Handle";

export interface UvData {
  name: string;
}

export interface UvProps {
  id: string;
  data: UvData;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
  nodeColor: store.nodeTypes.inputs.color,
});

export function Uv({ id, data }: UvProps): JSX.Element {
  const { isSelected, nodeColor } = useStore(selector(id), shallow);

  return (
    <BaseNode name={data.name} isSelected={isSelected} accentColor={nodeColor}>
      <div className="flex justify-end items-center">
        <span>Out</span>
      </div>
      <StyledHandle type="source" position={Position.Right} />
    </BaseNode>
  );
}
