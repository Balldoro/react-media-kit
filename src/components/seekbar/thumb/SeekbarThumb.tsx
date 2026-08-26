import { Thumb } from "@/components/common/Thumb";
import type { HTMLAttributes, Ref } from "react";
import { useMediaGlobalProps } from "@/hooks/dataProps";

export interface SeekbarThumbProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function SeekbarThumb(props: SeekbarThumbProps) {
  const mediaDataAttrs = useMediaGlobalProps();

  return <Thumb {...props} {...mediaDataAttrs} />;
}
