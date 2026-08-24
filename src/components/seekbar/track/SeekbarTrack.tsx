import { Track } from "@/components/common/Track";
import type { HTMLAttributes, Ref } from "react";

export interface SeekbarTrackProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function SeekbarTrack(props: SeekbarTrackProps) {
  return <Track {...props} />;
}
