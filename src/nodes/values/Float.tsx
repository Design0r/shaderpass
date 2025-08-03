import { Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "../BaseNode";
import { StyledHandle } from "../../handles/Handle";

export interface FloatData {
  name: string;
  value: string;
}

export interface FloatProps {
  id: string;
  data: FloatData;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
  nodeColor: store.nodeTypes.values.color,
});

export function Float({ id, data }: FloatProps): JSX.Element {
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
