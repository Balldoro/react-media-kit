import { Thumb } from "@/components/common/Thumb";
import type { HTMLAttributes } from "react";

export interface VolumeThumbProps extends HTMLAttributes<HTMLDivElement> {}

export function VolumeThumb(props: VolumeThumbProps) {
  return <Thumb {...props} />;
}
