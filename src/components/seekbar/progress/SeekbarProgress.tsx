import type { CSSProperties, HTMLAttributes } from "react";

export interface SeekbarProgressProps extends HTMLAttributes<HTMLDivElement> {}

export function SeekbarProgress({ style, ...props }: SeekbarProgressProps) {
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
  transform: `scaleX(calc(var(--elapsed-percent, 0) / 100))`,
  transformOrigin: "left",
  willChange: "transform",
};
