import { usePlayerControls } from "@/state/usePlayer";
import { useMediaReadyProps } from "@/hooks/dataProps";
import { composeHandlers } from "@/utils/handlers";
import { SKIP_INTERVAL } from "@/constants";
import type { ButtonAttributes } from "@/types";
import { createTimeLabelFormatter } from "@/utils/time";

export type SkipDirection = "back" | "forward";

interface SkipButtonRootProps extends ButtonAttributes {
  direction: SkipDirection;
  skipInterval?: number;
}

const getTimeLabel = createTimeLabelFormatter("en");

export function SkipButtonRoot({
  direction,
  skipInterval = SKIP_INTERVAL,
  onClick,
  ...props
}: SkipButtonRootProps) {
  const { skip } = usePlayerControls();

  const isForward = direction === "forward";
  const handleSkip = () => skip(isForward ? skipInterval : -skipInterval);

  return (
    <button
      aria-label={`Skip ${isForward ? "forward" : "back"} ${getTimeLabel(skipInterval)}`}
      {...props}
      type="button"
      onClick={composeHandlers(onClick, handleSkip)}
      data-direction={direction}
      {...useMediaReadyProps()}
    />
  );
}
