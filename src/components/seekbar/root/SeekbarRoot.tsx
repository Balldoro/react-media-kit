import {
  useMemo,
  useRef,
  type HTMLAttributes,
  type KeyboardEventHandler,
  type PointerEventHandler,
  type ReactNode,
} from "react";
import { usePlayer, usePlayerControls, usePlayerCtx } from "@/state/usePlayer";
import { useShallow } from "@/utils/useShallow";
import { createTimeLabelFormatter } from "@/utils/time";
import { SeekbarContext } from "../SeekbarContext";
import { SKIP_INTERVAL } from "@/constants";

export interface SeekbarRootProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  skipInterval?: number;
}

export function SeekbarRoot({
  children,
  skipInterval = SKIP_INTERVAL,
  ...props
}: SeekbarRootProps) {
  const sliderRect = useRef<DOMRect>(null);
  const { lang } = usePlayerCtx();
  const { seek, skip } = usePlayerControls();
  const { optimisticTime, currentTime, duration } = usePlayer(
    useShallow((s) => ({
      duration: s.durationInSec,
      optimisticTime: s.optimisticTimeInSec,
      currentTime: s.currentTimeInSec,
    })),
  );

  const displayedTime = optimisticTime ?? currentTime;

  const getTimeLabel = useMemo(() => createTimeLabelFormatter(lang), [lang]);

  const totalElapsedTimeLabel = `${getTimeLabel(displayedTime)} / ${getTimeLabel(duration)}`;
  const elapsedPercent = duration > 0 ? Number(((displayedTime / duration) * 100).toFixed(2)) : 0;

  function updateVideoTime(clickX: number) {
    if (!sliderRect.current) return;

    const { left, width } = sliderRect.current;
    const containerPos = Math.min(Math.max((clickX - left) / width, 0), 1);
    seek(containerPos * duration);
  }

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    const sliderEl = e.currentTarget;
    sliderRect.current = sliderEl.getBoundingClientRect();
    sliderEl.setPointerCapture(e.pointerId);
    updateVideoTime(e.clientX);
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    const sliderEl = e.currentTarget;
    if (!sliderEl.hasPointerCapture(e.pointerId)) return;
    updateVideoTime(e.clientX);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    let isMatched = true;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        skip(-skipInterval);
        break;
      case "ArrowRight":
      case "ArrowUp":
        skip(skipInterval);
        break;
      case "Home":
        seek(0);
        break;
      case "End":
        seek(duration);
        break;
      default:
        isMatched = false;
    }
    if (isMatched) e.preventDefault();
  };

  const value = useMemo(() => ({ elapsedPercent }), [elapsedPercent]);

  return (
    <div
      aria-label="Video player slider"
      {...props}
      role="slider"
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onKeyDown={handleKeyDown}
      aria-valuetext={totalElapsedTimeLabel}
      aria-valuemin={0}
      aria-valuemax={Math.floor(duration)}
      aria-valuenow={Math.floor(displayedTime)}
    >
      <SeekbarContext value={value}>{children}</SeekbarContext>
    </div>
  );
}
