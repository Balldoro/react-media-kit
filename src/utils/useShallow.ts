import { useRef } from "react";

import { isEqual } from "../utils";
import type { PlayerState, Selector } from "../types";

export function useShallow<T extends {}>(selector: Selector<T>) {
  const prev = useRef<T | null>(null);

  return (state: PlayerState) => {
    const next = selector(state);
    if (prev.current && isEqual(prev.current, next)) return prev.current;
    prev.current = next;
    return next;
  };
}
