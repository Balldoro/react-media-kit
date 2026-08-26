import type { HTMLAttributes, Ref } from "react";
import { useMediaGlobalProps } from "@/hooks/dataProps";

interface ControlsRootProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function ControlsRoot(props: ControlsRootProps) {
  const mediaDataAttrs = useMediaGlobalProps();

  return <div {...props} {...mediaDataAttrs} />;
}
