import { Handle, Position } from "@xyflow/react";
import { shallow } from "zustand/shallow";
import type { ChangeEvent, JSX } from "react";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "../../components/BaseNode";

export interface NumberData {
  value: number;
}

export interface NumberProps {
  id: string;
  data: NumberData;
}

const selector = (id: string) => (store: StoreState) => ({
  setValue: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { value: e.target.value }),
});

export function Number({ id, data }: NumberProps): JSX.Element {
  const { setValue } = useStore(selector(id), shallow);

  return (
    <BaseNode name="Number" accentColor="bg-gray-400">
      <label>
        <input
          className="nodrag input"
          type="number"
          value={data.value}
          onChange={setValue}
        />
      </label>

      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
}

export default Number;
