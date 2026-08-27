import { Thumb } from "@/components/common/Thumb";
import type { HTMLAttributes, Ref } from "react";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";

export interface SeekbarThumbProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function SeekbarThumb(props: SeekbarThumbProps) {
  const mediaDataAttrs = useMediaAttributes();

  return <Thumb {...props} {...mediaDataAttrs} />;
}
