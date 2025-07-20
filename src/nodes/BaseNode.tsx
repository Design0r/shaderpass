import type { JSX } from "react";

type DivProps = JSX.IntrinsicElements["div"];
interface BaseNodeProps extends DivProps {
  name: string;
  accentColor?: string;
  isSelected?: boolean;
  children: JSX.Element | JSX.Element[] | undefined;
}

export function BaseNode({
  name,
  accentColor = "fff",
  isSelected = false,
  className = "",
  children,
  ...props
}: BaseNodeProps): JSX.Element {
  return (
    <div
      className={`${className} rounded-xl border-2 ${isSelected ? "border-white" : "border-black"} bg-base-100`}
      {...props}
    >
      <div style={{ backgroundColor: accentColor }} className={"rounded-t-lg"}>
        <h2 className="p-1 text-black">{name}</h2>
      </div>
      <div className="p-2 min-w-32 min-h-10">{children}</div>
    </div>
  );
}
