import type { HTMLAttributes } from "react";

export interface SeekbarProgressProps extends HTMLAttributes<HTMLDivElement> {}

export function SeekbarProgress(props: SeekbarProgressProps) {
  return <div {...props} aria-hidden="true" />;
}
