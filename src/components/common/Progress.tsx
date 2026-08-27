import type { CSSProperties, HTMLAttributes, Ref } from "react";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  progressVar?: string;
  ref?: Ref<HTMLDivElement>;
}

export function Progress({ progressVar = "", style, ...props }: ProgressProps) {
  return (
    <div
      style={{ ...style, ...defaultStyle, transform: `scaleX(calc(var(${progressVar}, 0) / 100))` }}
      {...props}
    />
  );
}

const defaultStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  position: "absolute",
  transformOrigin: "left",
  willChange: "transform",
};
