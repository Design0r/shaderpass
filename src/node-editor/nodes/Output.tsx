import { Handle, Position } from "@xyflow/react";
import type { JSX } from "react";

import { BaseNode } from "../components/BaseNode";

export interface OutputData {}

export interface OutputProps {
  id: string;
  data: OutputData;
}

export function Output(_: OutputProps): JSX.Element {
  return (
    <BaseNode name="Output" accentColor="bg-gray-400">
      <Handle type="target" position={Position.Left} />
    </BaseNode>
  );
}
