import { Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "../BaseNode";
import { StyledHandle } from "../../handles/Handle";

export interface BooleanData {
  name: string;
  value: string;
}

export interface BooleanProps {
  id: string;
  data: BooleanData;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
  nodeColor: store.nodeTypes.values.color,
});

export function Boolean({ id, data }: BooleanProps): JSX.Element {
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
