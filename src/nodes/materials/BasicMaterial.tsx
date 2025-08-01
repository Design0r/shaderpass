import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";

import { BaseNode } from "../BaseNode";
import { useStore, type StoreState } from "../../state";
import { shallow } from "zustand/shallow";

export interface BasicMaterialData {
  name: string;
}

export interface BasicMaterialProps {
  id: string;
  data: BasicMaterialData;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
  nodeColor: store.nodeTypes.materials.color,
});

export function BasicMaterial({ id }: BasicMaterialProps): JSX.Element {
  const { isSelected, nodeColor } = useStore(selector(id), shallow);
  return (
    <BaseNode
      isSelected={isSelected}
      name="Basic Material"
      accentColor={nodeColor}
    >
      <div className="flex flex-col">
        <span>Displacement</span>
        <span>Color</span>
      </div>
      <Handle
        id={"vertex"}
        style={{ top: "55%" }}
        type="target"
        position={Position.Left}
      />
      <Handle
        id={"fragment"}
        style={{ top: "75%" }}
        className="mt-1"
        type="target"
        position={Position.Left}
      />
    </BaseNode>
  );
}
