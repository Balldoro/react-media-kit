import { Progress } from "@/components/common/Progress";
import type { HTMLAttributes, Ref } from "react";
import { CSS_VARS } from "@/constants";
import { useMediaGlobalProps } from "@/hooks/dataProps";

export interface SeekbarProgressProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function SeekbarProgress({ style, ...props }: SeekbarProgressProps) {
  const mediaDataAttrs = useMediaGlobalProps();

  return (
    <Progress
      progressVar={CSS_VARS.progressPercent}
      style={{ zIndex: 2, ...style }}
      {...props}
      {...mediaDataAttrs}
    />
  );
}
