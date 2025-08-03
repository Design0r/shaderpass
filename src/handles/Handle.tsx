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
    <StyledHandle
      {...rest}
      isConnectable={connections.length < props.connectionCount}
    />
  );
}

export function StyledHandle({
  style = {},
  ...props
}: HandleProps): JSX.Element {
  const newStyle: React.CSSProperties = {
    ...(style ?? {}),
    width: "10px",
    height: "10px",
  };

  return <Handle {...props} style={newStyle} />;
}
