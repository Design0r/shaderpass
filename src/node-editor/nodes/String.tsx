import { Handle, Position } from "@xyflow/react";
import type { ChangeEvent, JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "./BaseNode";

export interface StringData {
  value: string;
}

export interface StringProps {
  id: string;
  data: StringData;
}

const selector = (id: string) => (store: StoreState) => ({
  setValue: (e: ChangeEvent<HTMLInputElement>) =>
    store.updateNode(id, { value: e.target.value }),
});

export function String({ id, data }: StringProps): JSX.Element {
  const { setValue } = useStore(selector(id), shallow);

  return (
    <BaseNode name="String" accentColor="bg-gray-400">
      <input
        className="nodrag input"
        type="text"
        value={data.value}
        onChange={setValue}
      />

      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
}

export default String;
