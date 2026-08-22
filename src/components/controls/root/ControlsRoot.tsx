import type { CSSProperties, HTMLAttributes } from "react";

interface ControlsRootProps extends HTMLAttributes<HTMLDivElement> {
  overlay?: boolean;
}

export function ControlsRoot({ overlay = true, style, ...props }: ControlsRootProps) {
  return <div style={overlay ? { ...overlayStyle, ...style } : style} {...props} />;
}

const overlayStyle: CSSProperties = {
  position: "absolute",
  zIndex: 20,
  bottom: 0,
  left: 0,
  right: 0,
};
