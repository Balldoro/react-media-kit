import { CSS_VARS } from "@/constants";
import { useAnimateOnPlay } from "@/hooks/useAnimateOnPlay";
import { usePlayerCtx, usePlayerSubscription } from "@/state/PlayerContext";
import { safeDivide, toPercent } from "@/utils/math";
import { createTimeLabelFormatter } from "@/utils/time";
import { useCallback, useLayoutEffect, useMemo, type RefObject } from "react";

const UPDATE_INTERVAL_MS = 25;

export function useSeekbarTime(sliderEl: RefObject<HTMLDivElement | null>) {
  const { lang, getMedia } = usePlayerCtx();
  const { getSnapshot } = usePlayerSubscription();

  const getTimeLabel = useMemo(() => createTimeLabelFormatter(lang), [lang]);

  const draw = useCallback(() => {
    const media = getMedia();
    if (!media || !sliderEl.current) return;

    const { optimisticTimeInSec, durationInSec } = getSnapshot();
    const { currentTime } = media;
    const time = optimisticTimeInSec ?? currentTime;
    const elapsed = toPercent(safeDivide(time, durationInSec));
    const totalElapsedTimeLabel = `${getTimeLabel(time)} / ${getTimeLabel(durationInSec)}`;

    sliderEl.current.style.setProperty(CSS_VARS.progressPercent, elapsed.toFixed(2));
    sliderEl.current.setAttribute("aria-valuetext", totalElapsedTimeLabel);
    sliderEl.current.setAttribute("aria-valuenow", String(Math.floor(time)));
    sliderEl.current.setAttribute("aria-valuemax", String(Math.floor(durationInSec)));
  }, [getMedia, getTimeLabel, sliderEl, getSnapshot]);

  useAnimateOnPlay({ draw, intervalMs: UPDATE_INTERVAL_MS });

  useLayoutEffect(() => {
    draw();
  }, [lang, draw]);
}
