import { Thumb } from "@/components/common/Thumb";
import type { HTMLAttributes, Ref } from "react";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";

export interface VolumeThumbProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function VolumeThumb(props: VolumeThumbProps) {
  const mediaDataAttrs = useMediaAttributes();

  return <Thumb {...props} {...mediaDataAttrs} />;
}
