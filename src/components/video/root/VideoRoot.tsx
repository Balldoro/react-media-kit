import type { HTMLAttributes } from "react";

interface VideoRootProps extends HTMLAttributes<HTMLDivElement> {}

export function VideoRoot({ style, ...props }: VideoRootProps) {
  return <div style={{ position: "relative", ...style }} {...props} />;
}
