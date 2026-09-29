import { usePlayerControls } from "@/state/PlayerContext";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { composeHandlers } from "@/utils/handlers";
import { DATA_ATTRS, SKIP_INTERVAL } from "@/constants";
import type { ButtonAttributes } from "@/types";
import { createTimeLabelFormatter } from "@/utils/time";
import { Button } from "@/components/common/Button";
import { ReactMediaKitError } from "@/utils/errors";

export type SkipDirection = "back" | "forward";

interface SkipButtonRootProps extends ButtonAttributes {
  direction: SkipDirection;
  skipInterval?: number;
}

const getTimeLabel = createTimeLabelFormatter("en");

export function SkipButtonRoot({
  direction,
  skipInterval: rawSkipInterval = SKIP_INTERVAL,
  onClick,
  ...props
}: SkipButtonRootProps) {
  if (rawSkipInterval < 1 || Number.isNaN(rawSkipInterval)) {
    throw new ReactMediaKitError(
      `<SkipButton.Root> - \`skipInterval\` must be at least 1, got ${rawSkipInterval}.`,
    );
  }

  const { skip } = usePlayerControls();
  const mediaDataAttrs = useMediaAttributes();

  const skipInterval = Math.floor(rawSkipInterval);
  const isForward = direction === "forward";
  const handleSkip = () => skip(isForward ? skipInterval : -skipInterval);

  return (
    <Button
      aria-label={`Skip ${isForward ? "forward" : "back"} ${getTimeLabel(skipInterval)}`}
      {...props}
      onClick={composeHandlers(onClick, handleSkip)}
      {...{ [DATA_ATTRS.direction]: direction }}
      {...mediaDataAttrs}
    />
  );
}
