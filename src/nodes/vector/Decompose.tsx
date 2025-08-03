import { Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "../BaseNode";
import { StyledHandle } from "../../handles/Handle";

export interface DecomposeData {
  name: string;
  r: string;
  g: string;
  b: string;
  a: string;
}

export interface DecomposeProps {
  id: string;
  data: DecomposeData;
}

const selector = (id: string) => (state: StoreState) => ({
  isSelected: state.selectedNode?.id === id,
  nodeColor: state.nodeTypes.vector.color,
});

export function Decompose({ id, data }: DecomposeProps): JSX.Element {
  const { isSelected, nodeColor } = useStore(selector(id), shallow);

  return (
    <BaseNode isSelected={isSelected} name={data.name} accentColor={nodeColor}>
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
      <StyledHandle
        id="r"
        style={{ top: "37%" }}
        type="source"
        position={Position.Right}
      />
      <StyledHandle
        id="g"
        style={{ top: "53%" }}
        type="source"
        position={Position.Right}
      />
      <StyledHandle
        id="b"
        style={{ top: "69%" }}
        type="source"
        position={Position.Right}
      />
      <StyledHandle
        id="a"
        style={{ top: "85%" }}
        type="source"
        position={Position.Right}
      />
      <StyledHandle id="vec" type="target" position={Position.Left} />
    </BaseNode>
  );
}
