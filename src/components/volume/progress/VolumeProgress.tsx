import { Progress } from "@/components/common/Progress";
import type { HTMLAttributes } from "react";

export interface VolumeProgressProps extends HTMLAttributes<HTMLDivElement> {}

export function VolumeProgress(props: VolumeProgressProps) {
  return <Progress {...props} />;
}
