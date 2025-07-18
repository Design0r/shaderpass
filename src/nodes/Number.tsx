import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../state";
import { BaseNode } from "./BaseNode";

export interface NumberData {
  value: number;
}

export interface NumberProps {
  id: string;
  data: NumberData;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
});

export function NumberNode({ id }: NumberProps): JSX.Element {
  const { isSelected } = useStore(selector(id), shallow);

  return (
    <BaseNode name="Number" isSelected={isSelected} accentColor="bg-gray-400">
      <div className="flex justify-end items-center">
        <span>Out</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
}
