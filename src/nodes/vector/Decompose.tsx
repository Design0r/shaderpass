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

export function Vec4({ id }: Vec4Props): JSX.Element {
  const { isSelected, nodeColor } = useStore(selector(id), shallow);

  return (
    <BaseNode isSelected={isSelected} name="Vec4" accentColor={nodeColor}>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span>R</span>
          <span>G</span>
          <span>B</span>
          <span>A</span>
        </div>
        <div>
          <span>Out</span>
        </div>
      </div>
      <LimitHandle
        id="r"
        style={{ top: "37%" }}
        type="target"
        position={Position.Left}
        connectionCount={1}
      />
      <LimitHandle
        id="g"
        style={{ top: "53%" }}
        type="target"
        position={Position.Left}
        connectionCount={1}
      />
      <LimitHandle
        id="b"
        style={{ top: "69%" }}
        type="target"
        position={Position.Left}
        connectionCount={1}
      />
      <LimitHandle
        id="a"
        style={{ top: "85%" }}
        type="target"
        position={Position.Left}
        connectionCount={1}
      />
      <Handle id="out" type="source" position={Position.Right} />
    </BaseNode>
  );
}
