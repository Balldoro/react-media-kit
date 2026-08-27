import { CSS_VARS } from "@/constants";
import { usePlayerSubscription } from "@/state/PlayerContext";
import { safeDivide, toPercent } from "@/utils/math";
import { useEffect, type RefObject } from "react";

export function useBufferTime(sliderEl: RefObject<HTMLDivElement | null>) {
  const { subscribeWithSelector, getSnapshot } = usePlayerSubscription();

  useEffect(() => {
    if (!sliderEl.current) return;

    const unsubscribe = subscribeWithSelector(
      (s) => s.bufferedEndInSec,
      (bufferedEnd) => {
        if (!sliderEl.current) return;

        const { durationInSec } = getSnapshot();
        const buffered = toPercent(safeDivide(bufferedEnd ?? 0, durationInSec));

        sliderEl.current.style.setProperty(CSS_VARS.bufferPercent, buffered.toFixed(2));
      },
    );

    return unsubscribe;
  }, [sliderEl, subscribeWithSelector, getSnapshot]);
}
