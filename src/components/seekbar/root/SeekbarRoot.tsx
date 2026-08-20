import { useMemo, type HTMLAttributes, type ReactNode } from "react";
import { usePlayer, usePlayerCtx } from "@/state/usePlayer";
import { useShallow } from "@/utils/useShallow";
import { createTimeLabelFormatter } from "@/utils/time";

export interface SeekbarRootProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function SeekbarRoot({ children, ...props }: SeekbarRootProps) {
  const { lang } = usePlayerCtx();
  const { currentTime, duration } = usePlayer(
    useShallow((s) => ({ duration: s.durationInSec, currentTime: s.currentTimeInSec })),
  );
  const getTimeLabel = useMemo(() => createTimeLabelFormatter(lang), [lang]);

  const totalElapsedTimeLabel = `${getTimeLabel(currentTime)} / ${getTimeLabel(duration)}`;

  return (
    <div
      aria-valuetext={totalElapsedTimeLabel}
      aria-label="Video player slider"
      {...props}
      role="slider"
      tabIndex={0}
      aria-valuemin={0}
      aria-valuemax={Math.floor(duration)}
      aria-valuenow={Math.floor(currentTime)}
    >
      {children}
    </div>
  );
}
