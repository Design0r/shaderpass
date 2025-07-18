import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../state";
import { BaseNode } from "./BaseNode";

export interface MathData {
  operation: string;
}

export interface MathProps {
  id: string;
  data: MathData;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
});

export function Math({ id }: MathProps): JSX.Element {
  const { isSelected } = useStore(selector(id), shallow);

  return (
    <BaseNode isSelected={isSelected} name="Math" accentColor="bg-gray-400">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span>A</span>
          <span>B</span>
        </div>
        <div className="items-center">
          <span>Out</span>
        </div>
      </div>

      <Handle
        style={{ top: "54%" }}
        id={"a"}
        type="target"
        position={Position.Left}
      />
      <Handle
        style={{ top: "80%" }}
        id={"b"}
        type="target"
        position={Position.Left}
      />
      <Handle id={"out"} type="source" position={Position.Right} />
    </BaseNode>
  );
}

export default Math;
