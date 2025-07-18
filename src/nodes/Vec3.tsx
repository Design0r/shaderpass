import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";
import { useState, useEffect } from "react";
import { shallow } from "zustand/shallow";

import { useStore, type StoreState } from "../state";
import { BaseNode } from "./BaseNode";

export interface Vec3Data {
  r: number;
  g: number;
  b: number;
}

export interface Vec3Props {
  id: string;
  data: Vec3Data;
}

const selector = (id: string) => (store: StoreState) => ({
  isSelected: store.selectedNode?.id === id,
});

export function Vec3({ id }: Vec3Props): JSX.Element {
  const { isSelected } = useStore(selector(id), shallow);

  return (
    <BaseNode isSelected={isSelected} name="Vec3" accentColor="bg-gray-400">
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
