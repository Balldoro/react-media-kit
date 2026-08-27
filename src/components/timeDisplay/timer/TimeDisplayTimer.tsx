import { useRef, type Ref } from "react";
import { useTimeDisplayTimer } from "./useTimeDisplayTimer";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import type { TimeDisplayAttributes } from "@/types";

interface TimeDisplayTimerProps extends TimeDisplayAttributes {
  ref?: Ref<HTMLTimeElement>;
}

export function TimeDisplayTimer({ ref, ...props }: TimeDisplayTimerProps) {
  const timerRef = useRef<HTMLTimeElement>(null);
  const mergedRef = useMergeRefs(timerRef, ref);
  const mediaDataAttrs = useMediaAttributes();

  useTimeDisplayTimer(timerRef);

  return <time {...props} ref={mergedRef} {...mediaDataAttrs} />;
}
