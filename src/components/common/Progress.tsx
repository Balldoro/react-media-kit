import type { CSSProperties, HTMLAttributes } from "react";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {}

export function Progress({ style, ...props }: ProgressProps) {
  return (
    <div style={defaultStyle}>
      <div style={{ width: "100%", height: "100%", ...style }} {...props} />
    </div>
  );
}

const defaultStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  position: "absolute",
  transform: `scaleX(calc(var(--progress-percent, 0) / 100))`,
  transformOrigin: "left",
  willChange: "transform",
};
