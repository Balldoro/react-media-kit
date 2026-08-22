import { Thumb } from "@/components/common/Thumb";
import type { HTMLAttributes } from "react";

export interface SeekbarThumbProps extends HTMLAttributes<HTMLDivElement> {}

export function SeekbarThumb(props: SeekbarThumbProps) {
  return <Thumb {...props} />;
}
