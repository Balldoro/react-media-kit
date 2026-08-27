import type { HTMLAttributes, Ref } from "react";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";

interface ControlsRootProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function ControlsRoot(props: ControlsRootProps) {
  const mediaDataAttrs = useMediaAttributes();

  return <div {...props} {...mediaDataAttrs} />;
}
