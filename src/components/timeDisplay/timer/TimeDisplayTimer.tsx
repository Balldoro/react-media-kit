import { useRef, type HTMLAttributes } from "react";
import { useTimeDisplayTimer } from "./useTimeDisplayTimer";

interface TimeDisplayTimerProps extends Omit<HTMLAttributes<HTMLTimeElement>, "children"> {}

export function TimeDisplayTimer(props: TimeDisplayTimerProps) {
  const timerRef = useRef<HTMLTimeElement>(null);
  useTimeDisplayTimer(timerRef);

  return <time {...props} ref={timerRef} />;
}
