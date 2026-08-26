import { Track } from "@/components/common/Track";
import type { HTMLAttributes, Ref } from "react";
import { useMediaGlobalProps } from "@/hooks/dataProps";

export interface SeekbarTrackProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function SeekbarTrack(props: SeekbarTrackProps) {
  const mediaDataAttrs = useMediaGlobalProps();

  return <Track {...props} {...mediaDataAttrs} />;
}
