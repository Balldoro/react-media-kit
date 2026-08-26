import {
  BACK_NAV_KEYS,
  CSS_VARS,
  DATA_ATTRS,
  END_NAV_KEYS,
  MAX_VOLUME,
  MIN_VOLUME,
  NEXT_NAV_KEYS,
  START_NAV_KEYS,
} from "@/constants";
import { useRectPosition } from "@/hooks/useRectPosition";
import { usePlayerControls, usePlayerSubscription } from "@/state/PlayerContext";
import { shallow, toPercent } from "@/utils";
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

    sliderEl.current.style.setProperty(CSS_VARS.progressPercent, String(currentVolumePercent));
    sliderEl.current.setAttribute("aria-valuenow", String(currentVolume.toFixed(2)));
    sliderEl.current.setAttribute(
      "aria-valuetext",
      computeAriaValueTextStable.current?.({ volume, isMuted }) ?? `${currentVolumePercent}%`,
    );
    sliderEl.current.toggleAttribute(DATA_ATTRS.muted, isMuted);
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
    sliderEl.current.setAttribute(DATA_ATTRS.dragging, "true");
    updateVolume(e.clientX);
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!sliderEl.current || !sliderEl.current.hasPointerCapture(e.pointerId)) return;

    updateVolume(e.clientX);
  };

  const handleLostPointerCapture: PointerEventHandler<HTMLDivElement> = () => {
    if (!sliderEl.current) return;

    sliderEl.current.toggleAttribute(DATA_ATTRS.dragging, false);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    switch (true) {
      case BACK_NAV_KEYS.has(e.key):
        e.preventDefault();
        return stepVolume(-volumeInterval);
      case NEXT_NAV_KEYS.has(e.key):
        e.preventDefault();
        return stepVolume(volumeInterval);
      case START_NAV_KEYS.has(e.key):
        e.preventDefault();
        return setVolume(MIN_VOLUME);
      case END_NAV_KEYS.has(e.key):
        e.preventDefault();
        return setVolume(MAX_VOLUME);
    }
  };

  return { handlePointerDown, handlePointerMove, handleLostPointerCapture, handleKeyDown };
}
