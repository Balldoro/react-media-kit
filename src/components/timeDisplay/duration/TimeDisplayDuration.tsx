import { usePlayer } from "@/state/usePlayer";
import { getDurationTimeFormat, getTimeFormat } from "@/utils/time";
import type { HTMLAttributes } from "react";

interface TimeDisplayDurationProps extends Omit<HTMLAttributes<HTMLTimeElement>, "children"> {}

export function TimeDisplayDuration(props: TimeDisplayDurationProps) {
  const duration = usePlayer((s) => s.durationInSec);

  return (
    <time {...props} dateTime={getDurationTimeFormat(duration)}>
      {getTimeFormat(duration)}
    </time>
  );
}
