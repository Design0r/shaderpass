import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";

import { BaseNode } from "./BaseNode";

export interface OutputData {}

export interface OutputProps {
  id: string;
  data: OutputData;
}

export function ShaderOutput(_: OutputProps): JSX.Element {
  return (
    <BaseNode name="Output" accentColor="bg-gray-400">
      <div className="flex flex-col">
        <span>Vertex Shader</span>
        <span>Fragment Shader</span>
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

export default ShaderOutput;
