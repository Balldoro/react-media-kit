import { createContext, use } from "react";

export type TimerMode = "elapsed" | "remaining";

export interface TimeDisplayContextValue {
  isElapsedMode: boolean;
  toggleMode: () => void;
  setMode: (mode: TimerMode) => void;
}

export const TimeDisplayContext = createContext<TimeDisplayContextValue | null>(null);

export const useTimeDisplay = () => {
  const ctx = use(TimeDisplayContext);

  if (!ctx) {
    throw new Error("useTimeDisplay used outside of the TimeDisplayProvider!");
  }

  return ctx;
};
