import { MAX_VOLUME, MIN_VOLUME } from "@/constants";
import { useRectPosition } from "@/hooks/useRectPosition";
import { usePlayerControls, usePlayerSubscription } from "@/state/PlayerContext";
import { shallow, toPercent } from "@/utils";
import { handleNavKeyDown } from "@/utils/handlers";
import { clampVolume } from "@/utils/volume";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type KeyboardEventHandler,
  type PointerEventHandler,
  type RefObject,
} from "react";

interface Config {
  volumeInterval: number;
  computeAriaValueText?: ({ volume, isMuted }: { volume: number; isMuted: boolean }) => string;
}

export function useVolume(
  sliderEl: RefObject<HTMLDivElement | null>,
  { volumeInterval, computeAriaValueText }: Config,
) {
  const computeAriaValueTextStable = useRef(computeAriaValueText);

  const { setRect: setSliderRect, calcRectPositionX } = useRectPosition();
  const { subscribeWithSelector, getSnapshot } = usePlayerSubscription();
  const { stepVolume, setVolume } = usePlayerControls();

  const updateSliderEl = useCallback(() => {
    if (!sliderEl.current) return;

    const { volume, isMuted } = getSnapshot();
    const currentVolume = isMuted ? 0 : volume;
    const currentVolumePercent = toPercent(currentVolume).toFixed(2);

    sliderEl.current.style.setProperty("--progress-percent", String(currentVolumePercent));
    sliderEl.current.setAttribute("aria-valuenow", String(currentVolume));
    sliderEl.current.setAttribute(
      "aria-valuetext",
      computeAriaValueTextStable.current?.({ volume, isMuted }) ?? `${currentVolumePercent}%`,
    );
    sliderEl.current.setAttribute("data-ismuted", String(isMuted));
  }, [getSnapshot, sliderEl]);

  useEffect(() => {
    computeAriaValueTextStable.current = computeAriaValueText;
  }, [computeAriaValueText]);

  useLayoutEffect(() => {
    const unsubscribe = subscribeWithSelector(
      shallow((s) => ({ volume: s.volume, isMuted: s.isMuted })),
      updateSliderEl,
    );

    updateSliderEl();

    return unsubscribe;
  }, [subscribeWithSelector, updateSliderEl, sliderEl]);

  function updateVolume(clickX: number) {
    const calculatedPosition = calcRectPositionX(clickX);
    if (calculatedPosition == null) return;

    setVolume(clampVolume(calculatedPosition));
    updateSliderEl();
  }

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!sliderEl.current) return;

    setSliderRect(sliderEl.current.getBoundingClientRect());
    sliderEl.current.setPointerCapture(e.pointerId);
    updateVolume(e.clientX);
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!sliderEl.current || !sliderEl.current.hasPointerCapture(e.pointerId)) return;

    updateVolume(e.clientX);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) =>
    handleNavKeyDown(e, {
      onBack: () => stepVolume(-volumeInterval),
      onNext: () => stepVolume(volumeInterval),
      onStart: () => setVolume(MIN_VOLUME),
      onEnd: () => setVolume(MAX_VOLUME),
    });

  return { handlePointerDown, handlePointerMove, handleKeyDown };
}
