import { usePlayerCtx } from "@/state/PlayerContext";
import type { HTMLAttributes, Ref } from "react";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useMediaGlobalProps } from "@/hooks/dataProps";

interface AudioPlayerProps extends HTMLAttributes<HTMLAudioElement> {
  src?: string;
  ref?: Ref<HTMLAudioElement>;
}

export function AudioPlayer({ ref, ...props }: AudioPlayerProps) {
  const { mediaEl } = usePlayerCtx();
  const mergedRef = useMergeRefs(mediaEl, ref);
  const mediaDataAttrs = useMediaGlobalProps();

  return <audio ref={mergedRef} {...props} {...mediaDataAttrs} />;
}
