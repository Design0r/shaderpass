import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "../BaseNode";
import { LimitHandle } from "../../handles/Handle";

export interface Vec4Data {
  name: string;
  r: string;
  g: string;
  b: string;
  a: string;
}

export interface Vec4Props {
  id: string;
  data: Vec4Data;
}

const selector = (id: string) => (state: StoreState) => ({
  isSelected: state.selectedNode?.id === id,
  nodeColor: state.nodeTypes.vector.color,
});

export function Decompose({ id }: Vec4Props): JSX.Element {
  const { isSelected, nodeColor } = useStore(selector(id), shallow);

  return (
    <BaseNode isSelected={isSelected} name="Decompose" accentColor={nodeColor}>
      <div className="flex justify-between">
        <div>
          <span>Vec</span>
        </div>
        <div className="flex flex-col">
          <span>R</span>
          <span>G</span>
          <span>B</span>
          <span>A</span>
        </div>
      </div>
      <Handle
        id="r"
        style={{ top: "37%" }}
        type="source"
        position={Position.Right}
      />
      <Handle
        id="g"
        style={{ top: "53%" }}
        type="source"
        position={Position.Right}
      />
      <Handle
        id="b"
        style={{ top: "69%" }}
        type="source"
        position={Position.Right}
      />
      <Handle
        id="a"
        style={{ top: "85%" }}
        type="source"
        position={Position.Right}
      />
      <Handle id="vec" type="target" position={Position.Left} />
    </BaseNode>
  );
}
