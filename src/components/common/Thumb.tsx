import type { CSSProperties, HTMLAttributes, Ref } from "react";

export interface ThumbProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function Thumb(props: ThumbProps) {
  return (
    <div style={defaultContainerStyle}>
      <div style={defaultStyle}>
        <div {...props} />
      </div>
    </div>
  );
}

const defaultContainerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  position: "absolute",
  transform: `translateX(calc(var(--progress-percent, 0) * 1%))`,
  willChange: "transform",
  pointerEvents: "none",
  left: 0,
};

const defaultStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translate(-50%, -50%)",
};
