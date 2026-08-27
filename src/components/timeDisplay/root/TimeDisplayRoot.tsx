import { useCallback, useMemo, useState, type HTMLAttributes, type Ref } from "react";
import {
  TimeDisplayContext,
  type TimeDisplayContextValue,
  type TimerMode,
} from "../TimeDisplayContext";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";

interface TimeDisplayRootProps extends HTMLAttributes<HTMLDivElement> {
  initialMode?: "elapsed" | "remaining";
  ref?: Ref<HTMLDivElement>;
}

export function TimeDisplayRoot({ initialMode = "elapsed", ...props }: TimeDisplayRootProps) {
  const [isElapsedMode, setIsElapsedMode] = useState(initialMode === "elapsed");
  const mediaDataAttrs = useMediaAttributes();

  const setMode = useCallback((mode: TimerMode) => setIsElapsedMode(mode === "elapsed"), []);
  const toggleMode = useCallback(() => setIsElapsedMode((m) => !m), []);

  const value: TimeDisplayContextValue = useMemo(
    () => ({ isElapsedMode, setMode, toggleMode }),
    [isElapsedMode, setMode, toggleMode],
  );

  return (
    <TimeDisplayContext value={value}>
      <div {...props} {...mediaDataAttrs} />
    </TimeDisplayContext>
  );
}
