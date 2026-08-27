import { usePlayerCtx } from "@/state/PlayerContext";
import type { MediaHTMLAttributes, Ref } from "react";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";

interface AudioPlayerProps extends MediaHTMLAttributes<HTMLAudioElement> {
  src?: string;
  ref?: Ref<HTMLAudioElement>;
}

export function AudioPlayer({ ref, ...props }: AudioPlayerProps) {
  const { attachMedia } = usePlayerCtx();
  const mergedRef = useMergeRefs(attachMedia, ref);
  const mediaDataAttrs = useMediaAttributes();

  return <audio ref={mergedRef} {...props} {...mediaDataAttrs} />;
}
