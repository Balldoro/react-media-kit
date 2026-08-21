import { usePlayerCtx, usePlayerSubscription } from "@/state/usePlayer";
import { createTimeLabelFormatter } from "@/utils/time";
import { useCallback, useEffect, useMemo, type RefObject } from "react";

const UPDATE_INTERVAL_MS = 25;

export function useSeekbarTime(sliderEl: RefObject<HTMLDivElement | null>) {
  const { lang, videoEl } = usePlayerCtx();
  const { subscribe, getSnapshot } = usePlayerSubscription();

  const getTimeLabel = useMemo(() => createTimeLabelFormatter(lang), [lang]);

  const draw = useCallback(() => {
    if (!videoEl.current || !sliderEl.current) return;

    const { optimisticTimeInSec, durationInSec } = getSnapshot();
    const { currentTime } = videoEl.current;
    const time = optimisticTimeInSec ?? currentTime;
    const elapsed = durationInSec > 0 ? (time / durationInSec) * 100 : 0;
    const totalElapsedTimeLabel = `${getTimeLabel(time)} / ${getTimeLabel(durationInSec)}`;

    sliderEl.current.style.setProperty("--elapsed-percent", elapsed.toFixed(2));
    sliderEl.current.setAttribute("aria-valuetext", totalElapsedTimeLabel);
    sliderEl.current.setAttribute("aria-valuenow", String(Math.floor(time)));
  }, [videoEl, sliderEl, getTimeLabel, getSnapshot]);

  useEffect(() => {
    let animateFrame: number | null = null;
    let prevTime = 0;

    const animate = (time: number) => {
      const deltaTime = time - prevTime;
      if (deltaTime >= UPDATE_INTERVAL_MS) {
        draw();
        prevTime = time;
      }
      animateFrame = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (animateFrame !== null) return;
      prevTime = 0;
      animateFrame = requestAnimationFrame(animate);
    };

    const stopLoop = () => {
      if (animateFrame === null) return;
      cancelAnimationFrame(animateFrame);
      animateFrame = null;
    };

    const unsubscribe = subscribe(() => {
      if (getSnapshot().isPlaying) {
        startLoop();
      } else {
        stopLoop();
        draw();
      }
    });

    if (getSnapshot().isPlaying) startLoop();

    return () => {
      unsubscribe();
      stopLoop();
    };
  }, [draw, subscribe, getSnapshot]);
}
