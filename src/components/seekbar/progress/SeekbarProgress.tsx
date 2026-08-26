import { Progress } from "@/components/common/Progress";
import type { HTMLAttributes, Ref } from "react";

export interface SeekbarProgressProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function SeekbarProgress(props: SeekbarProgressProps) {
  return <Progress progressVar="--progress-percent" {...props} />;
}
