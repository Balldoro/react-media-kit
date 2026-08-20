import { createContext, use } from "react";

interface SeekbarContextValue {
  elapsedPercent: number;
}

export const SeekbarContext = createContext<SeekbarContextValue | null>(null);

export const useSeekbar = () => {
  const ctx = use(SeekbarContext);

  if (!ctx) {
    throw new Error("useSeekbar needs to be used inside Seekbar.Root component!");
  }

  return ctx;
};
