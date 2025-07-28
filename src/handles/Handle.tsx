import { Handle, useNodeConnections, type HandleProps } from "@xyflow/react";
import type { HTMLAttributes, JSX } from "react";

export function LimitHandle(
  props: HandleProps &
    Omit<HTMLAttributes<HTMLDivElement>, "id"> & { connectionCount: number },
): JSX.Element {
  const connections = useNodeConnections({
    handleType: props.type,
    handleId: props.id || undefined,
  });

  return (
    <Handle
      {...props}
      isConnectable={connections.length < props.connectionCount}
    />
  );
}
