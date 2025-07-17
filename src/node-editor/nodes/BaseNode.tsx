import type { JSX } from "react";

type DivProps = JSX.IntrinsicElements["div"];
interface BaseNodeProps extends DivProps {
  name: string;
  accentColor?: string;
  children: JSX.Element | JSX.Element[] | undefined;
}

export function BaseNode({
  name,
  accentColor = "bg-gray-400",
  className = "",
  children,
  ...props
}: BaseNodeProps): JSX.Element {
  return (
    <div
      className={`${className} rounded-xl border-2 border-white bg-base-100`}
      {...props}
    >
      <div className={`${accentColor} rounded-t-lg`}>
        <h2 className="p-1 text-white">{name}</h2>
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}
