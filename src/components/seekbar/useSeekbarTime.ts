import { useAnimate } from "@/hooks/useAnimate";
import { usePlayer, usePlayerCtx, usePlayerSubscription } from "@/state/usePlayer";
import { createTimeLabelFormatter } from "@/utils/time";
import { useMemo, type RefObject } from "react";

const UPDATE_INTERVAL_MS = 25;

export function useSeekbarTime(sliderEl: RefObject<HTMLDivElement | null>) {
  const { lang, videoEl } = usePlayerCtx();
  const { getSnapshot } = usePlayerSubscription();

  const isPlaying = usePlayer((s) => s.isPlaying);
  useAnimate({ draw, intervalMs: UPDATE_INTERVAL_MS, isActive: isPlaying });

  const getTimeLabel = useMemo(() => createTimeLabelFormatter(lang), [lang]);

  function draw() {
    if (!videoEl.current || !sliderEl.current) return;

    const { optimisticTimeInSec, durationInSec } = getSnapshot();
    const { currentTime } = videoEl.current;
    const time = optimisticTimeInSec ?? currentTime;
    const elapsed = durationInSec > 0 ? (time / durationInSec) * 100 : 0;
    const totalElapsedTimeLabel = `${getTimeLabel(time)} / ${getTimeLabel(durationInSec)}`;

    sliderEl.current.style.setProperty("--progress-percent", elapsed.toFixed(2));
    sliderEl.current.setAttribute("aria-valuetext", totalElapsedTimeLabel);
    sliderEl.current.setAttribute("aria-valuenow", String(Math.floor(time)));
  }
}
