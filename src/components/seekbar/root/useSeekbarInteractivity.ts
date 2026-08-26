import { useRectPosition } from "@/hooks/useRectPosition";
import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { handleNavKeyDown } from "@/utils/handlers";
import { DATA_ATTRS } from "@/constants";
import { type KeyboardEventHandler, type PointerEventHandler, type RefObject } from "react";

interface Config {
  skipInterval: number;
}

export function useSeekbarInteractivity(
  sliderEl: RefObject<HTMLDivElement | null>,
  { skipInterval }: Config,
) {
  const duration = usePlayer((s) => s.durationInSec);
  const { seek, skip } = usePlayerControls();
  const { setRect: setSliderRect, calcRectPositionX } = useRectPosition();

  function updateVideoTime(clickX: number) {
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
    updateVideoTime(e.clientX);
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!sliderEl.current || !sliderEl.current.hasPointerCapture(e.pointerId)) return;

    updateVideoTime(e.clientX);
  };

  const handleLostPointerCapture: PointerEventHandler<HTMLDivElement> = () => {
    if (!sliderEl.current) return;

    sliderEl.current.toggleAttribute(DATA_ATTRS.dragging, false);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) =>
    handleNavKeyDown(e, {
      onNext: () => skip(skipInterval),
      onBack: () => skip(-skipInterval),
      onStart: () => seek(0),
      onEnd: () => seek(duration),
    });

  return { handlePointerDown, handleLostPointerCapture, handlePointerMove, handleKeyDown };
}
