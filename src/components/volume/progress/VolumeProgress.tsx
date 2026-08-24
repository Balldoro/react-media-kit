import { Progress } from "@/components/common/Progress";
import type { HTMLAttributes, Ref } from "react";

export interface VolumeProgressProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function VolumeProgress(props: VolumeProgressProps) {
  return <Progress {...props} />;
}
