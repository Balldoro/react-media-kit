import type { Ref } from "react";
import { usePlayer } from "@/state/PlayerContext";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { getDurationTimeFormat, getTimeFormat } from "@/utils/time";
import type { TimeDisplayAttributes } from "@/types";

interface TimeDisplayDurationProps extends TimeDisplayAttributes {
  ref?: Ref<HTMLTimeElement>;
}

export function TimeDisplayDuration(props: TimeDisplayDurationProps) {
  const mediaDataAttrs = useMediaAttributes();
  const duration = usePlayer((s) => s.durationInSec);

  return (
    <time {...props} dateTime={getDurationTimeFormat(duration)} {...mediaDataAttrs}>
      {getTimeFormat(duration)}
    </time>
  );
}
