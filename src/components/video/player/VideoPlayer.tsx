import { usePlayerCtx } from "@/state/usePlayer";
import type { HTMLAttributes } from "react";

interface VideoPlayerProps extends HTMLAttributes<HTMLVideoElement> {
  src: string;
}

export function VideoPlayer(props: VideoPlayerProps) {
  const { videoEl } = usePlayerCtx();
  return <video ref={videoEl} style={{ width: "100%", height: "100%" }} {...props} />;
}
