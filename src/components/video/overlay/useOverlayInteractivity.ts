import { DOUBLE_CLICK_DELTA_MS, SKIP_INTERVAL } from "@/constants";
import { usePlayerControls, usePlayerCtx } from "@/state/PlayerContext";
import {
  useEffect,
  useRef,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type PointerEvent,
  type PointerEventHandler,
} from "react";

type OnDoubleClick = "fullscreen" | "skip" | PointerEventHandler<HTMLButtonElement>;

export interface OverlayInteractivityOptions {
  onPointerUp?: MouseEventHandler<HTMLButtonElement>;
  onPointerDown?: MouseEventHandler<HTMLButtonElement>;
  onDoubleClick?: OnDoubleClick;
  onDoubleTouch?: OnDoubleClick;
  doubleClickInterval?: number;
  skipInterval?: number;
}

export function useOverlayInteractivity({
  onPointerUp,
  onPointerDown,
  onDoubleTouch = "skip",
  onDoubleClick = "fullscreen",
  doubleClickInterval = DOUBLE_CLICK_DELTA_MS,
  skipInterval = SKIP_INTERVAL,
}: OverlayInteractivityOptions) {
  const pointedDownEl = useRef<HTMLElement>(null);
  const prevClickTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const prevClick = useRef(0);

  const { containerEl } = usePlayerCtx();
  const { toggle, toggleFullscreen, skip } = usePlayerControls();

  useEffect(() => {
    return () => {
      if (prevClickTimer.current) {
        clearTimeout(prevClickTimer.current);
      }
    };
  }, []);

  const fireDoubleClick = (e: PointerEvent<HTMLButtonElement>, onDouble: OnDoubleClick) => {
    if (prevClickTimer.current) {
      clearTimeout(prevClickTimer.current);
      prevClickTimer.current = null;
    }

    if (typeof onDouble === "function") return onDouble(e);
    if (onDouble === "fullscreen") return toggleFullscreen();
    if (onDouble === "skip") return skip(skipInterval);
  };

  const handlePointerDown: PointerEventHandler<HTMLButtonElement> = (e) => {
    onPointerDown?.(e);
    if (e.defaultPrevented) return;

    pointedDownEl.current = e.currentTarget;
  };

  const handlePointerUp: PointerEventHandler<HTMLButtonElement> = (e) => {
    onPointerUp?.(e);
    if (e.defaultPrevented || !containerEl.current?.contains(pointedDownEl.current)) return;

    const now = performance.now();
    const delta = now - prevClick.current;
    const isSingleClick = delta > doubleClickInterval;

    pointedDownEl.current = null;
    prevClick.current = now;

    if (isSingleClick) {
      prevClickTimer.current = setTimeout(() => {
        toggle();
        prevClickTimer.current = null;
      }, doubleClickInterval);
    } else {
      fireDoubleClick(e, e.pointerType === "mouse" ? onDoubleClick : onDoubleTouch);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
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
      case "Enter":
      case " ":
        toggle();
        break;
      default:
        isMatched = false;
    }
    if (isMatched) e.preventDefault();
  };

  return { handlePointerUp, handlePointerDown, handleKeyDown };
}
