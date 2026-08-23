import { usePlayer } from "@/state/PlayerContext";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import { getDurationTimeFormat, getTimeFormat } from "@/utils/time";
import type { HTMLAttributes } from "react";

interface TimeDisplayDurationProps extends Omit<HTMLAttributes<HTMLTimeElement>, "children"> {}

export function TimeDisplayDuration(props: TimeDisplayDurationProps) {
  const duration = usePlayer((s) => s.durationInSec);

  return (
    <time {...props} dateTime={getDurationTimeFormat(duration)} {...useMediaGlobalProps()}>
      {getTimeFormat(duration)}
    </time>
  );
}
