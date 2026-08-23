import type { CSSProperties, HTMLAttributes } from "react";
import { useMediaGlobalProps } from "@/hooks/dataProps";

interface ControlsRootProps extends HTMLAttributes<HTMLDivElement> {
  overlay?: boolean;
}

export function ControlsRoot({ overlay = true, style, ...props }: ControlsRootProps) {
  return (
    <div
      style={overlay ? { ...overlayStyle, ...style, position: "absolute" } : style}
      {...props}
      {...useMediaGlobalProps()}
    />
  );
}

const overlayStyle: CSSProperties = {
  bottom: 0,
  left: 0,
  right: 0,
};
