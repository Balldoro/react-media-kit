import { Thumb } from "@/components/common/Thumb";
import type { HTMLAttributes, Ref } from "react";

export interface VolumeThumbProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function VolumeThumb(props: VolumeThumbProps) {
  return <Thumb {...props} />;
}
