import { Progress } from "@/components/common/Progress";
import type { HTMLAttributes, Ref } from "react";
import { CSS_VARS } from "@/constants";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";

export interface VolumeProgressProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function VolumeProgress(props: VolumeProgressProps) {
  const mediaDataAttrs = useMediaAttributes();

  return <Progress progressVar={CSS_VARS.progressPercent} {...props} {...mediaDataAttrs} />;
}
