import type { HTMLAttributes, Ref } from "react";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";

interface VideoRootProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function VideoRoot({ style, ...props }: VideoRootProps) {
  const mediaDataAttrs = useMediaAttributes();

  return <div style={{ ...style, position: "relative" }} {...props} {...mediaDataAttrs} />;
}
