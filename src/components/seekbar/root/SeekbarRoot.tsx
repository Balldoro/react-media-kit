import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { usePlayer } from "@/state/usePlayer";
import { SKIP_INTERVAL } from "@/constants";
import { useSeekbarTime } from "../useSeekbarTime";
import { useSeekbarInteractivity } from "../useSeekbarInteractivity";
import { composeHandlers } from "@/utils/handlers";

export interface SeekbarRootProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  skipInterval?: number;
}

export function SeekbarRoot({
  style,
  children,
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
    <div
      ref={sliderEl}
      aria-label="Video player slider"
      {...props}
      style={{
        touchAction: "none",
        position: "relative",
        cursor: "pointer",
        width: "100%",
        ...style,
      }}
      role="slider"
      tabIndex={0}
      onPointerDown={composeHandlers(onPointerDown, handlePointerDown)}
      onPointerMove={composeHandlers(onPointerMove, handlePointerMove)}
      onKeyDown={composeHandlers(onKeyDown, handleKeyDown)}
      aria-valuemin={0}
      aria-valuemax={Math.floor(duration)}
    >
      {children}
    </div>
  );
}
