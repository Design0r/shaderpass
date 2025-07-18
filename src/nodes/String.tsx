import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../state";
import { BaseNode } from "./BaseNode";

export interface StringData {
  value: string;
}

export interface StringProps {
  id: string;
  data: StringData;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
});

export function String({ id }: StringProps): JSX.Element {
  const { isSelected } = useStore(selector(id), shallow);

  return (
    <BaseNode isSelected={isSelected} name="String" accentColor="bg-gray-400">
      <div className="flex justify-center items-center">
        <span>Out</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
}
