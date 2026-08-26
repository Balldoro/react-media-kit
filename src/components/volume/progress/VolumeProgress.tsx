import { Progress } from "@/components/common/Progress";
import type { HTMLAttributes, Ref } from "react";
import { useMediaGlobalProps } from "@/hooks/dataProps";

export interface VolumeProgressProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function VolumeProgress(props: VolumeProgressProps) {
  const mediaDataAttrs = useMediaGlobalProps();

  return <Progress progressVar="--progress-percent" {...props} {...mediaDataAttrs} />;
}
