import type { ReactNode } from "react";
import { usePlayerControls } from "@/state/PlayerContext";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import { composeHandlers } from "@/utils/handlers";
import type { ButtonAttributes } from "@/types";

interface PlaybackRateButtonRootProps extends Omit<ButtonAttributes, "children"> {
  playbackRate: number;
  children?: ReactNode | ((props: { playbackRate: number }) => ReactNode);
}

export function PlaybackRateButtonRoot({
  playbackRate,
  onClick,
  children,
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
    >
      {typeof children === "function" ? children({ playbackRate }) : children}
    </button>
  );
}
