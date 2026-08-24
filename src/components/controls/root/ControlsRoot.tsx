import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { useMediaGlobalProps } from "@/hooks/dataProps";

interface ControlsRootProps extends HTMLAttributes<HTMLDivElement> {
  overlay?: boolean;
  ref?: Ref<HTMLDivElement>;
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
