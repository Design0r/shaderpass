import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "../BaseNode";

export interface FloatData {
  name: string;
  value: number;
}

export interface FloatProps {
  id: string;
  data: FloatData;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
  nodeColor: store.nodeTypes.values.color,
});

export function Float({ id }: FloatProps): JSX.Element {
  const { isSelected, nodeColor } = useStore(selector(id), shallow);

  return (
    <BaseNode name="Float" isSelected={isSelected} accentColor={nodeColor}>
      <div className="flex justify-end items-center">
        <span>Out</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
}
