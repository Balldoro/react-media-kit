import type { Ref } from "react";
import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import { composeHandlers } from "@/utils/handlers";
import { setDataAttr } from "@/utils";
import { DATA_ATTRS } from "@/constants";
import type { ButtonAttributes } from "@/types";

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
  const mediaDataAttrs = useMediaGlobalProps();
  const activePlaybackRate = usePlayer((s) => s.playbackRate);

  const handleClick = () => setPlaybackRate(playbackRate);

  return (
    <button
      aria-label={`Playback speed: ${playbackRate}x`}
      {...props}
      type="button"
      onClick={composeHandlers(onClick, handleClick)}
      {...{ [DATA_ATTRS.active]: setDataAttr(activePlaybackRate === playbackRate) }}
      {...mediaDataAttrs}
    />
  );
}
