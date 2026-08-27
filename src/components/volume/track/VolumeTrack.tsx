import { Track } from "@/components/common/Track";
import type { HTMLAttributes, Ref } from "react";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";

export interface VolumeTrackProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function VolumeTrack(props: VolumeTrackProps) {
  const mediaDataAttrs = useMediaAttributes();

  return <Track {...props} {...mediaDataAttrs} />;
}
