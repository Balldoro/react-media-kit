import { Track } from "@/components/common/Track";
import type { HTMLAttributes } from "react";

export interface VolumeTrackProps extends HTMLAttributes<HTMLDivElement> {}

export function VolumeTrack(props: VolumeTrackProps) {
  return <Track {...props} />;
}
