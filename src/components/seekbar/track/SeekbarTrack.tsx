import { Track } from "@/components/common/Track";
import type { HTMLAttributes } from "react";

export interface SeekbarTrackProps extends HTMLAttributes<HTMLDivElement> {}

export function SeekbarTrack(props: SeekbarTrackProps) {
  return <Track {...props} />;
}
