import { Track } from "@/components/common/Track";
import type { HTMLAttributes, Ref } from "react";
import { useMediaGlobalProps } from "@/hooks/dataProps";

export interface VolumeTrackProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function VolumeTrack(props: VolumeTrackProps) {
  const mediaDataAttrs = useMediaGlobalProps();

  return <Track {...props} {...mediaDataAttrs} />;
}
