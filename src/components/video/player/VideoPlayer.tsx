import { usePlayerCtx } from "@/state/PlayerContext";
import type { HTMLAttributes, Ref } from "react";
import { useMergeRefs } from "@/hooks/useMergeRefs";

interface VideoPlayerProps extends HTMLAttributes<HTMLVideoElement> {
  src: string;
  ref?: Ref<HTMLVideoElement>;
}

export function VideoPlayer({ style, ref, ...props }: VideoPlayerProps) {
  const { videoEl } = usePlayerCtx();
  const mergedRef = useMergeRefs(videoEl, ref);

  return <video ref={mergedRef} style={{ width: "100%", height: "auto", ...style }} {...props} />;
}
