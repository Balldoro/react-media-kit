import { usePlayerCtx, usePlayerSubscription } from "@/state/PlayerContext";
import { getDurationTimeFormat, getTimeFormat } from "@/utils/time";
import { useCallback, useLayoutEffect, type RefObject } from "react";
import { useTimeDisplay } from "../TimeDisplayContext";
import { useAnimateOnPlay } from "@/hooks/useAnimateOnPlay";

const UPDATE_INTERVAL_MS = 250;

export function useTimeDisplayTimer(timerRef: RefObject<HTMLTimeElement | null>) {
  const { isElapsedMode } = useTimeDisplay();
  const { getMedia } = usePlayerCtx();
  const { getSnapshot } = usePlayerSubscription();

  const draw = useCallback(() => {
    const media = getMedia();
    if (!media || !timerRef.current) return;

    const { optimisticTimeInSec, durationInSec } = getSnapshot();
    const time = optimisticTimeInSec ?? media.currentTime;
    const remainingTime = durationInSec - time;
    const displayTime = isElapsedMode ? time : remainingTime;

    timerRef.current.textContent = `${isElapsedMode ? "" : "-"}${getTimeFormat(displayTime)}`;
    timerRef.current.dateTime = getDurationTimeFormat(displayTime);
  }, [isElapsedMode, getMedia, timerRef, getSnapshot]);

  useAnimateOnPlay({ draw, intervalMs: UPDATE_INTERVAL_MS });

  useLayoutEffect(() => {
    draw();
  }, [isElapsedMode, draw]);
}
