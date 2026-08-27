import { CSS_VARS, DATA_ATTRS, KEY_NAMES, MAX_VOLUME, MIN_VOLUME } from "@/constants";
import { useRectPosition } from "@/hooks/useRectPosition";
import { usePlayerControls, usePlayerSubscription } from "@/state/PlayerContext";
import { shallow } from "@/state/shallow";
import { toPercent } from "@/utils/math";
import { normalizeKeyCode } from "@/utils/handlers";
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
    switch (normalizeKeyCode(e.key)) {
      case KEY_NAMES.ARROW_LEFT:
      case KEY_NAMES.ARROW_DOWN:
        e.preventDefault();
        return stepVolume(-volumeInterval);
      case KEY_NAMES.ARROW_RIGHT:
      case KEY_NAMES.ARROW_UP:
        e.preventDefault();
        return stepVolume(volumeInterval);
      case KEY_NAMES.HOME:
        e.preventDefault();
        return setVolume(MIN_VOLUME);
      case KEY_NAMES.END:
        e.preventDefault();
        return setVolume(MAX_VOLUME);
    }
  };

  return { handlePointerDown, handlePointerMove, handleLostPointerCapture, handleKeyDown };
}
