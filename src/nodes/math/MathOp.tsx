import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "../BaseNode";

export interface MathOpData {
  name: string;
  operation: string;
}

export interface MathOpProps {
  id: string;
  data: MathOpData;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
  nodeColor: store.nodeTypes.math.color,
});

export function MathOp({ id, data }: MathOpProps): JSX.Element {
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
