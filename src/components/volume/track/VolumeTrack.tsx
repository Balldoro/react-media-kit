import { Track } from "@/components/common/Track";
import type { HTMLAttributes, Ref } from "react";

export interface VolumeTrackProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function VolumeTrack(props: VolumeTrackProps) {
  return <Track {...props} />;
}
