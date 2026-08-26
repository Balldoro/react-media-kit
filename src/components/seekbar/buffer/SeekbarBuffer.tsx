import { Progress } from "@/components/common/Progress";
import { type HTMLAttributes, type Ref } from "react";

export interface SeekbarBufferProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function SeekbarBuffer(props: SeekbarBufferProps) {
  return <Progress progressVar="--buffer-percent" {...props} />;
}
