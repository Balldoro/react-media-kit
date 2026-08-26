import { usePlayerCtx } from "@/state/PlayerContext";
import type { HTMLAttributes, Ref } from "react";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useMediaGlobalProps } from "@/hooks/dataProps";

interface VideoPlayerProps extends HTMLAttributes<HTMLVideoElement> {
  src: string;
  ref?: Ref<HTMLVideoElement>;
}

export function VideoPlayer({ ref, ...props }: VideoPlayerProps) {
  const { videoEl } = usePlayerCtx();
  const mergedRef = useMergeRefs(videoEl, ref);
  const mediaDataAttrs = useMediaGlobalProps();

  return <video ref={mergedRef} {...props} {...mediaDataAttrs} />;
}
