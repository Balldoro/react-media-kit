import { usePlayerCtx } from "@/state/PlayerContext";
import type { Ref, VideoHTMLAttributes } from "react";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";

interface VideoPlayerProps extends VideoHTMLAttributes<HTMLVideoElement> {
  src?: string;
  ref?: Ref<HTMLVideoElement>;
}

export function VideoPlayer({ ref, ...props }: VideoPlayerProps) {
  const { mediaEl } = usePlayerCtx();
  const mergedRef = useMergeRefs(mediaEl, ref);
  const mediaDataAttrs = useMediaAttributes();

  return <video ref={mergedRef} {...props} {...mediaDataAttrs} />;
}
