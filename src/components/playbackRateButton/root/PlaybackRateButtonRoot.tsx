import type { Ref } from "react";
import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { composeHandlers } from "@/utils/handlers";
import { setDataAttr } from "@/utils/dom";
import { DATA_ATTRS } from "@/constants";
import type { ButtonAttributes } from "@/types";
import { Button } from "@/components/common/Button";

interface PlaybackRateButtonRootProps extends ButtonAttributes {
  playbackRate: number;
  ref?: Ref<HTMLButtonElement>;
}

export function PlaybackRateButtonRoot({
  playbackRate,
  onClick,
  ...props
}: PlaybackRateButtonRootProps) {
  const { setPlaybackRate } = usePlayerControls();
  const mediaDataAttrs = useMediaAttributes();
  const activePlaybackRate = usePlayer((s) => s.playbackRate);

  const handleClick = () => setPlaybackRate(playbackRate);

  return (
    <Button
      aria-label={`Playback speed: ${playbackRate}x`}
      {...props}
      onClick={composeHandlers(onClick, handleClick)}
      {...{ [DATA_ATTRS.active]: setDataAttr(activePlaybackRate === playbackRate) }}
      {...mediaDataAttrs}
    />
  );
}
