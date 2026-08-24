import type { CSSProperties, HTMLAttributes, Ref } from "react";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function Progress(props: ProgressProps) {
  return (
    <div style={defaultStyle}>
      <div {...props} />
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
