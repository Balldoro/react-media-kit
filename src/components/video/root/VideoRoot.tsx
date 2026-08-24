import type { HTMLAttributes, Ref } from "react";
import { useMediaGlobalProps } from "@/hooks/dataProps";

interface VideoRootProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function VideoRoot({ style, ...props }: VideoRootProps) {
  return <div style={{ ...style, position: "relative" }} {...props} {...useMediaGlobalProps()} />;
}
