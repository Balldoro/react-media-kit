import type { Ref } from "react";
import { usePlayerControls } from "@/state/PlayerContext";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import { composeHandlers } from "@/utils/handlers";
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

  const handleClick = () => setPlaybackRate(playbackRate);

  return (
    <button
      aria-label={`Playback speed: ${playbackRate}x`}
      {...props}
      type="button"
      onClick={composeHandlers(onClick, handleClick)}
      data-playbackrate={playbackRate}
      {...useMediaGlobalProps()}
    />
  );
}
