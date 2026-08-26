import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { CSS_VARS } from "@/constants";

export interface ThumbProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function Thumb({ style, ...props }: ThumbProps) {
  return (
    <div style={defaultContainerStyle}>
      <div style={{ ...defaultStyle, ...style }} {...props} />
    </div>
  );
}

const defaultContainerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  position: "absolute",
  transform: `translateX(calc(var(${CSS_VARS.progressPercent}, 0) * 1%))`,
  willChange: "transform",
  pointerEvents: "none",
  left: 0,
  zIndex: "var(--seekbar-thumb-z-index, 9999)",
};

const defaultStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translate(-50%, -50%)",
};
