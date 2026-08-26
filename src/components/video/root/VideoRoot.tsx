import type { HTMLAttributes, Ref } from "react";
import { useMediaGlobalProps } from "@/hooks/dataProps";

interface VideoRootProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function VideoRoot({ style, ...props }: VideoRootProps) {
  const mediaDataAttrs = useMediaGlobalProps();

  return <div style={{ ...style, position: "relative" }} {...props} {...mediaDataAttrs} />;
}
