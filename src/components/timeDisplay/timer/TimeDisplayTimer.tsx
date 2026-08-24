import { useRef, type HTMLAttributes, type Ref } from "react";
import { useTimeDisplayTimer } from "./useTimeDisplayTimer";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import { useMergeRefs } from "@/hooks/useMergeRefs";

interface TimeDisplayTimerProps extends Omit<HTMLAttributes<HTMLTimeElement>, "children"> {
  ref?: Ref<HTMLTimeElement>;
}

export function TimeDisplayTimer({ ref, ...props }: TimeDisplayTimerProps) {
  const timerRef = useRef<HTMLTimeElement>(null);
  const mergedRef = useMergeRefs(timerRef, ref);

  useTimeDisplayTimer(timerRef);

  return <time {...props} ref={mergedRef} {...useMediaGlobalProps()} />;
}
