import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../../state";
import { BaseNode } from "../BaseNode";

export interface Vec2Data {
  name: string;
  x: number;
  y: number;
}

export interface Vec2Props {
  id: string;
  data: Vec2Data;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
  nodeColor: store.nodeTypes.values.color,
});

export function Vec2({ id }: Vec2Props): JSX.Element {
  const { isSelected, nodeColor } = useStore(selector(id), shallow);

  return (
    <BaseNode isSelected={isSelected} name="Vec2" accentColor={nodeColor}>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span>X</span>
          <span>Y</span>
        </div>
        <div>
          <span>Out</span>
        </div>
      </div>
      <Handle
        id="x"
        style={{ top: "50%" }}
        type="target"
        position={Position.Left}
      />
      <Handle
        id="y"
        style={{ top: "80%" }}
        type="target"
        position={Position.Left}
      />
      <Handle id="out" type="source" position={Position.Right} />
    </BaseNode>
  );
}

export interface Vec3Data {
  r: number;
  g: number;
  b: number;
}

export interface Vec3Props {
  id: string;
  data: Vec3Data;
}

export function Vec3({ id }: Vec3Props): JSX.Element {
  const { isSelected, nodeColor } = useStore(selector(id), shallow);

  return (
    <BaseNode isSelected={isSelected} name="Vec3" accentColor={nodeColor}>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span>R</span>
          <span>G</span>
          <span>B</span>
        </div>
        <div>
          <span>Out</span>
        </div>
      </div>
      <Handle
        id="r"
        style={{ top: "37%" }}
        type="target"
        position={Position.Left}
      />
      <Handle
        id="g"
        style={{ top: "60%" }}
        type="target"
        position={Position.Left}
      />
      <Handle
        id="b"
        style={{ top: "83%" }}
        type="target"
        position={Position.Left}
      />
      <Handle id="out" type="source" position={Position.Right} />
    </BaseNode>
  );
}

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
      <Handle
        id="r"
        style={{ top: "37%" }}
        type="target"
        position={Position.Left}
      />
      <Handle
        id="g"
        style={{ top: "53%" }}
        type="target"
        position={Position.Left}
      />
      <Handle
        id="b"
        style={{ top: "69%" }}
        type="target"
        position={Position.Left}
      />
      <Handle
        id="a"
        style={{ top: "85%" }}
        type="target"
        position={Position.Left}
      />
      <Handle id="out" type="source" position={Position.Right} />
    </BaseNode>
  );
}
