import type { HTMLAttributes } from "react";
import { useMediaGlobalProps } from "@/hooks/dataProps";

interface VideoRootProps extends HTMLAttributes<HTMLDivElement> {}

export function VideoRoot({ style, ...props }: VideoRootProps) {
  return <div style={{ ...style, position: "relative" }} {...props} {...useMediaGlobalProps()} />;
}
