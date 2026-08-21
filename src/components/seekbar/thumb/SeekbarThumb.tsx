import type { CSSProperties, HTMLAttributes } from "react";

export interface SeekbarThumbProps extends HTMLAttributes<HTMLDivElement> {}

export function SeekbarThumb(props: SeekbarThumbProps) {
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
  transform: `translateX(calc(var(--elapsed-percent, 0) * 1%))`,
  willChange: "transform",
  left: 0,
};

const defaultStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translate(-50%, -50%)",
};
