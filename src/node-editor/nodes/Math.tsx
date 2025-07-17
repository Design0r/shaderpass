import { Handle, Position } from "@xyflow/react";
import type { ChangeEvent, JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "./BaseNode";

export interface MathData {
  operation: string;
}

export interface MathProps {
  id: string;
  data: MathData;
}

const selector = (id: string) => (store: StoreState) => ({
  setOperation: (e: ChangeEvent<HTMLSelectElement>) =>
    store.updateNode(id, { operation: e.target.value }),
});

export function Math({ id, data }: MathProps): JSX.Element {
  const { setOperation } = useStore(selector(id), shallow);

  return (
    <BaseNode name="Math" accentColor="bg-gray-400">
      <div className="flex flex-col">
        <span>A</span>
        <select
          className="nodrag select"
          onChange={setOperation}
          value={data.operation}
        >
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">*</option>
          <option value="/">/</option>
        </select>
        <span>B</span>
      </div>

      <Handle
        style={{ top: "40%" }}
        id={"a"}
        type="target"
        position={Position.Left}
      />
      <Handle
        style={{ top: "85%" }}
        id={"b"}
        type="target"
        position={Position.Left}
      />
      <Handle id={"out"} type="source" position={Position.Right} />
    </BaseNode>
  );
}

export default Math;
