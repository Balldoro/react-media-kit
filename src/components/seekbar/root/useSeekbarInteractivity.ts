import { useRectPosition } from "@/hooks/useRectPosition";
import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { handleNavKeyDown } from "@/utils/handlers";
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
    updateVideoTime(e.clientX);
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!sliderEl.current || !sliderEl.current.hasPointerCapture(e.pointerId)) return;

    updateVideoTime(e.clientX);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) =>
    handleNavKeyDown(e, {
      onNext: () => skip(skipInterval),
      onBack: () => skip(-skipInterval),
      onStart: () => seek(0),
      onEnd: () => seek(duration),
    });

  return { handlePointerDown, handlePointerMove, handleKeyDown };
}
