import { DOUBLE_CLICK_DELTA_MS, KEY_NAMES } from "@/constants";
import { usePlayerControls, usePlayerCtx } from "@/state/PlayerContext";
import { normalizeKeyCode } from "@/utils/handlers";
import {
  useEffect,
  useRef,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type PointerEvent,
  type PointerEventHandler,
} from "react";

type OnDoubleClick = "fullscreen" | PointerEventHandler<HTMLButtonElement>;

export interface OverlayInteractivityOptions {
  onPointerUp?: MouseEventHandler<HTMLButtonElement>;
  onPointerDown?: MouseEventHandler<HTMLButtonElement>;
  onDoubleClick?: OnDoubleClick;
  onDoubleTouch?: OnDoubleClick;
  doubleClickInterval?: number;
}

export function useOverlayInteractivity({
  onPointerUp,
  onPointerDown,
  onDoubleTouch = "fullscreen",
  onDoubleClick = "fullscreen",
  doubleClickInterval = DOUBLE_CLICK_DELTA_MS,
}: OverlayInteractivityOptions) {
  const pointedDownEl = useRef<HTMLElement>(null);
  const prevClickTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const prevClick = useRef(0);

  const { getContainer } = usePlayerCtx();
  const { toggle, toggleFullscreen } = usePlayerControls();

  useEffect(() => {
    return () => {
      if (prevClickTimer.current) {
        clearTimeout(prevClickTimer.current);
      }
    };
  }, []);

  const fireDoubleClick = (e: PointerEvent<HTMLButtonElement>, onDoubleClick: OnDoubleClick) => {
    if (prevClickTimer.current) {
      clearTimeout(prevClickTimer.current);
      prevClickTimer.current = null;
    }

    if (typeof onDoubleClick === "function") return onDoubleClick(e);
    if (onDoubleClick === "fullscreen") return toggleFullscreen();
  };

  const handlePointerDown: PointerEventHandler<HTMLButtonElement> = (e) => {
    onPointerDown?.(e);
    if (e.defaultPrevented) return;

    pointedDownEl.current = e.currentTarget;
  };

  const handlePointerUp: PointerEventHandler<HTMLButtonElement> = (e) => {
    onPointerUp?.(e);

    const container = getContainer();
    if (e.defaultPrevented || !container?.contains(pointedDownEl.current)) return;

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
    switch (normalizeKeyCode(e.key)) {
      case KEY_NAMES.ENTER:
      case KEY_NAMES.SPACE:
        e.preventDefault();
        return toggle();
    }
  };

  return { handlePointerUp, handlePointerDown, handleKeyDown };
}
