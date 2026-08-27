import type { Ref } from "react";
import { usePlayerControls } from "@/state/PlayerContext";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { composeHandlers } from "@/utils/handlers";
import { DATA_ATTRS, SKIP_INTERVAL } from "@/constants";
import type { ButtonAttributes } from "@/types";
import { createTimeLabelFormatter } from "@/utils/time";

export type SkipDirection = "back" | "forward";

interface SkipButtonRootProps extends ButtonAttributes {
  direction: SkipDirection;
  skipInterval?: number;
  ref?: Ref<HTMLButtonElement>;
}

const getTimeLabel = createTimeLabelFormatter("en");

export function SkipButtonRoot({
  direction,
  skipInterval = SKIP_INTERVAL,
  onClick,
  ...props
}: SkipButtonRootProps) {
  const { skip } = usePlayerControls();
  const mediaDataAttrs = useMediaAttributes();

  const isForward = direction === "forward";
  const handleSkip = () => skip(isForward ? skipInterval : -skipInterval);

  return (
    <button
      aria-label={`Skip ${isForward ? "forward" : "back"} ${getTimeLabel(skipInterval)}`}
      {...props}
      type="button"
      onClick={composeHandlers(onClick, handleSkip)}
      {...{ [DATA_ATTRS.direction]: direction }}
      {...mediaDataAttrs}
    />
  );
}
