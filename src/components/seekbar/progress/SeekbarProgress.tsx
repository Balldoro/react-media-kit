import { Progress } from "@/components/common/Progress";
import type { HTMLAttributes, Ref } from "react";
import { useMediaGlobalProps } from "@/hooks/dataProps";

export interface SeekbarProgressProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function SeekbarProgress({ style, ...props }: SeekbarProgressProps) {
  const mediaDataAttrs = useMediaGlobalProps();

  return (
    <Progress
      progressVar="--progress-percent"
      style={{ zIndex: 2, ...style }}
      {...props}
      {...mediaDataAttrs}
    />
  );
}
