import { usePlayerCtx } from "@/state/PlayerContext";
import type { CSSProperties, HTMLAttributes, Ref } from "react";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useMediaGlobalProps } from "@/hooks/dataProps";

interface VideoPlayerProps extends HTMLAttributes<HTMLVideoElement> {
  src: string;
  ref?: Ref<HTMLVideoElement>;
}

export function VideoPlayer({ style, ref, ...props }: VideoPlayerProps) {
  const { videoEl } = usePlayerCtx();
  const mergedRef = useMergeRefs(videoEl, ref);
  const mediaDataAttrs = useMediaGlobalProps();

  return (
    <video ref={mergedRef} style={{ ...defaultStyle, ...style }} {...props} {...mediaDataAttrs} />
  );
}

const defaultStyle: CSSProperties = {
  width: "100%",
  height: "auto",
};
