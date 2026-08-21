import { usePlayer, usePlayerControls } from "@/state/usePlayer";
import { useRef, type KeyboardEventHandler, type PointerEventHandler, type RefObject } from "react";

interface Config {
  skipInterval: number;
}

export function useSeekbarInteractivity(
  sliderEl: RefObject<HTMLDivElement | null>,
  { skipInterval }: Config,
) {
  const sliderRect = useRef<DOMRect>(null);
  const duration = usePlayer((s) => s.durationInSec);
  const { seek, skip } = usePlayerControls();

  function updateVideoTime(clickX: number) {
    if (!sliderRect.current) return;

    const { left, width } = sliderRect.current;
    const containerPos = Math.min(Math.max((clickX - left) / width, 0), 1);
    seek(containerPos * duration);
  }

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!sliderEl.current) return;

    sliderRect.current = sliderEl.current.getBoundingClientRect();
    sliderEl.current.setPointerCapture(e.pointerId);
    updateVideoTime(e.clientX);
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!sliderEl.current || !sliderEl.current.hasPointerCapture(e.pointerId)) return;

    updateVideoTime(e.clientX);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    let isMatched = true;
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        skip(-skipInterval);
        break;
      case "ArrowRight":
      case "ArrowUp":
        skip(skipInterval);
        break;
      case "Home":
        seek(0);
        break;
      case "End":
        seek(duration);
        break;
      default:
        isMatched = false;
    }
    if (isMatched) e.preventDefault();
  };

  return { handlePointerDown, handlePointerMove, handleKeyDown };
}
