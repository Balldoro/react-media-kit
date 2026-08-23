import { useRef, type CSSProperties, type HTMLAttributes } from "react";
import { usePlayer } from "@/state/PlayerContext";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import { SKIP_INTERVAL } from "@/constants";
import { useSeekbarTime } from "./useSeekbarTime";
import { useSeekbarInteractivity } from "./useSeekbarInteractivity";
import { composeHandlers } from "@/utils/handlers";
import { Slider } from "@/components/common/Slider";

export interface SeekbarRootProps extends HTMLAttributes<HTMLDivElement> {
  skipInterval?: number;
}

export function SeekbarRoot({
  style,
  skipInterval = SKIP_INTERVAL,
  onKeyDown,
  onPointerMove,
  onPointerDown,
  ...props
}: SeekbarRootProps) {
  const sliderEl = useRef<HTMLDivElement>(null);
  const duration = usePlayer((s) => s.durationInSec);

  useSeekbarTime(sliderEl);
  const { handlePointerDown, handlePointerMove, handleKeyDown } = useSeekbarInteractivity(
    sliderEl,
    { skipInterval },
  );

  return (
    <Slider
      ref={sliderEl}
      aria-label="Video player slider"
      style={{ ...defaultStyle, ...style }}
      {...props}
      onPointerDown={composeHandlers(onPointerDown, handlePointerDown)}
      onPointerMove={composeHandlers(onPointerMove, handlePointerMove)}
      onKeyDown={composeHandlers(onKeyDown, handleKeyDown)}
      aria-valuemin={0}
      aria-valuemax={Math.floor(duration)}
      {...useMediaGlobalProps()}
    />
  );
}

const defaultStyle: CSSProperties = {
  // TODO: Those are hardcoded sane values that prevent Thumb from overflowing. This would make use of ResizeObserver attached
  // to the Thumb element to dynamically calculate it, as consumer applies his own, custom width
  paddingLeft: 6,
  paddingRight: 6,
};
