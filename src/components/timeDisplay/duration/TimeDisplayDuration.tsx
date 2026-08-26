import { usePlayer } from "@/state/PlayerContext";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import { getDurationTimeFormat, getTimeFormat } from "@/utils/time";
import type { HTMLAttributes, Ref } from "react";

interface TimeDisplayDurationProps extends Omit<HTMLAttributes<HTMLTimeElement>, "children"> {
  ref?: Ref<HTMLTimeElement>;
}

export function TimeDisplayDuration(props: TimeDisplayDurationProps) {
  const mediaDataAttrs = useMediaGlobalProps();
  const duration = usePlayer((s) => s.durationInSec);

  return (
    <time {...props} dateTime={getDurationTimeFormat(duration)} {...mediaDataAttrs}>
      {getTimeFormat(duration)}
    </time>
  );
}
