import { Thumb } from "@/components/common/Thumb";
import type { HTMLAttributes, Ref } from "react";

export interface SeekbarThumbProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function SeekbarThumb(props: SeekbarThumbProps) {
  return <Thumb {...props} />;
}
