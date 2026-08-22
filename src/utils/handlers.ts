import { BACK_NAV_KEYS, END_NAV_KEYS, NEXT_NAV_KEYS, START_NAV_KEYS } from "@/constants";
import type { VoidFunc } from "@/types";
import type { KeyboardEvent } from "react";

type EventHandler<E> = ((event: E) => void) | undefined;

export const composeHandlers = <E>(...handlers: EventHandler<E>[]) => {
  return (event: E) => {
    for (const handler of handlers) {
      if ((event as Event).defaultPrevented) return;
      handler?.(event);
    }
  };
};

interface NavKeyDownHandlers {
  onNext: VoidFunc;
  onBack: VoidFunc;
  onStart?: VoidFunc;
  onEnd?: VoidFunc;
}

export const handleNavKeyDown = (
  e: KeyboardEvent,
  { onNext, onBack, onEnd, onStart }: NavKeyDownHandlers,
) => {
  let isMatched = true;
  try {
    if (BACK_NAV_KEYS.has(e.key)) return onBack();
    if (NEXT_NAV_KEYS.has(e.key)) return onNext();
    if (START_NAV_KEYS.has(e.key)) return onStart?.();
    if (END_NAV_KEYS.has(e.key)) return onEnd?.();
    isMatched = false;
  } finally {
    if (isMatched) e.preventDefault();
  }
};
