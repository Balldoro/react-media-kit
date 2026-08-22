import { usePlayer, usePlayerCtx, usePlayerSubscription } from "@/state/usePlayer";
import { getDurationTimeFormat, getTimeFormat } from "@/utils/time";
import { useCallback, useEffect, type RefObject } from "react";
import { useTimeDisplay } from "../TimeDisplayContext";
import { useAnimate } from "@/hooks/useAnimate";

const UPDATE_INTERVAL_MS = 250;

export function useTimeDisplayTimer(timerRef: RefObject<HTMLTimeElement | null>) {
  const { isElapsedMode } = useTimeDisplay();
  const { videoEl } = usePlayerCtx();
  const isPlaying = usePlayer((s) => s.isPlaying);
  const { getSnapshot } = usePlayerSubscription();

  const draw = useCallback(() => {
    if (!videoEl.current || !timerRef.current) return;

    const { optimisticTimeInSec, durationInSec } = getSnapshot();
    const time = optimisticTimeInSec ?? videoEl.current.currentTime;

    const remainingTime = durationInSec - time;
    const displayTime = isElapsedMode ? time : remainingTime;

    timerRef.current.textContent = `${isElapsedMode ? "" : "-"}${getTimeFormat(displayTime)}`;
    timerRef.current.dateTime = getDurationTimeFormat(displayTime);
  }, [isElapsedMode, videoEl, timerRef, getSnapshot]);

  useAnimate({ draw, intervalMs: UPDATE_INTERVAL_MS, isActive: isPlaying });

  useEffect(() => {
    draw();
  }, [isElapsedMode, draw]);
}
