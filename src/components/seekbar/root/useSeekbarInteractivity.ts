import { useRectPosition } from "@/hooks/useRectPosition";
import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { DATA_ATTRS, KEY_NAMES } from "@/constants";
import { useRef, type KeyboardEventHandler, type PointerEventHandler, type RefObject } from "react";
import { normalizeKeyCode } from "@/utils/handlers";

interface Config {
  skipInterval: number;
}

export function useSeekbarInteractivity(
  sliderEl: RefObject<HTMLDivElement | null>,
  { skipInterval }: Config,
) {
  const duration = usePlayer((s) => s.durationInSec);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const { seek, skip, play, pause } = usePlayerControls();
  const { setRect: setSliderRect, calcRectPositionX } = useRectPosition();

  const isPausedRef = useRef(false);

  function updateMediaTime(clickX: number) {
    const calculatedPosition = calcRectPositionX(clickX);
    if (calculatedPosition == null) return;

    const containerPos = Math.min(Math.max(calculatedPosition, 0), 1);
    seek(containerPos * duration);
  }

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!sliderEl.current) return;

    setSliderRect(sliderEl.current.getBoundingClientRect());
    sliderEl.current.setPointerCapture(e.pointerId);
    sliderEl.current.setAttribute(DATA_ATTRS.dragging, "true");
    updateMediaTime(e.clientX);

    if (!isPausedRef.current && isPlaying) {
      isPausedRef.current = true;
      pause();
    }
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!sliderEl.current || !sliderEl.current.hasPointerCapture(e.pointerId)) return;

    updateMediaTime(e.clientX);
  };

  const handleLostPointerCapture: PointerEventHandler<HTMLDivElement> = () => {
    if (!sliderEl.current) return;

    sliderEl.current.toggleAttribute(DATA_ATTRS.dragging, false);

    if (isPausedRef.current) {
      isPausedRef.current = false;
      play();
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    switch (normalizeKeyCode(e.key)) {
      case KEY_NAMES.ARROW_LEFT:
      case KEY_NAMES.ARROW_DOWN:
        e.preventDefault();
        return skip(-skipInterval);
      case KEY_NAMES.ARROW_RIGHT:
      case KEY_NAMES.ARROW_UP:
        e.preventDefault();
        return skip(skipInterval);
      case KEY_NAMES.HOME:
        e.preventDefault();
        return seek(0);
      case KEY_NAMES.END:
        e.preventDefault();
        return seek(duration);
    }
  };

  return { handlePointerDown, handleLostPointerCapture, handlePointerMove, handleKeyDown };
}
