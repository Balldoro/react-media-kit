import type { MediaHTMLAttributes } from "react";
import { useMediaElement, type MediaElementProps } from "../useMediaElement";
import { ReactMediaKitError } from "@/utils/errors";

type MediaAudioProps = MediaHTMLAttributes<HTMLAudioElement> & MediaElementProps<HTMLAudioElement>;

export function MediaAudio({ ref, src, attachEngine, ...props }: MediaAudioProps) {
  if (src && attachEngine) {
    throw new ReactMediaKitError("<Media.Audio> - pass either `src` or `attachEngine`, not both.");
  }

  const { mediaRef, mediaDataAttrs } = useMediaElement({ ref, attachEngine });

  return <audio ref={mediaRef} src={src} {...props} {...mediaDataAttrs} />;
}
