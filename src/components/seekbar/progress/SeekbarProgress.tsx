import { Progress } from "@/components/common/Progress";
import type { HTMLAttributes } from "react";

export interface SeekbarProgressProps extends HTMLAttributes<HTMLDivElement> {}

export function SeekbarProgress(props: SeekbarProgressProps) {
  return <Progress {...props} />;
}
