import { Thumb } from "@/components/common/Thumb";
import type { HTMLAttributes, Ref } from "react";
import { useMediaGlobalProps } from "@/hooks/dataProps";

export interface VolumeThumbProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function VolumeThumb(props: VolumeThumbProps) {
  const mediaDataAttrs = useMediaGlobalProps();

  return <Thumb {...props} {...mediaDataAttrs} />;
}
