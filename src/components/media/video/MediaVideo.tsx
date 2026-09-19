import type { VideoHTMLAttributes } from "react";
import { useMediaElement, type MediaElementProps } from "../useMediaElement";
import { ReactMediaKitError } from "@/utils/errors";

type MediaVideoProps = VideoHTMLAttributes<HTMLVideoElement> & MediaElementProps<HTMLVideoElement>;

export function MediaVideo({ ref, src, attachEngine, ...props }: MediaVideoProps) {
  if (src && attachEngine) {
    throw new ReactMediaKitError("<Media.Video> - pass either `src` or `attachEngine`, not both.");
  }

  const { mediaRef, mediaDataAttrs } = useMediaElement({ ref, attachEngine });

  return <video ref={mediaRef} src={src} {...props} {...mediaDataAttrs} />;
}
