import { Handle, useNodeConnections, type HandleProps } from "@xyflow/react";
import type { HTMLAttributes, JSX } from "react";

export function LimitHandle(
  props: HandleProps &
    Omit<HTMLAttributes<HTMLDivElement>, "id"> & { connectionCount: number },
): JSX.Element {
  const { connectionCount, ...rest } = props;
  const connections = useNodeConnections({
    handleType: rest.type,
    handleId: rest.id || undefined,
  });

  return (
    <Handle
      {...rest}
      isConnectable={connections.length < props.connectionCount}
    />
  );
}
