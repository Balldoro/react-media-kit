import { useRef, type HTMLAttributes, type Ref } from "react";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { SKIP_INTERVAL } from "@/constants";
import { useSeekbarTime } from "./useSeekbarTime";
import { useSeekbarInteractivity } from "./useSeekbarInteractivity";
import { composeHandlers } from "@/utils/handlers";
import { Slider } from "@/components/common/Slider";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useBufferTime } from "./useBufferTimer";

export interface SeekbarRootProps extends HTMLAttributes<HTMLDivElement> {
  skipInterval?: number;
  ref?: Ref<HTMLDivElement>;
}

export function SeekbarRoot({
  skipInterval = SKIP_INTERVAL,
  ref,
  onKeyDown,
  onPointerMove,
  onPointerDown,
  onLostPointerCapture,
  ...props
}: SeekbarRootProps) {
  const sliderEl = useRef<HTMLDivElement>(null);
  const mediaDataAttrs = useMediaAttributes();

  useSeekbarTime(sliderEl);
  useBufferTime(sliderEl);

  const mergedRef = useMergeRefs(sliderEl, ref);
  const { handlePointerDown, handleLostPointerCapture, handlePointerMove, handleKeyDown } =
    useSeekbarInteractivity(sliderEl, { skipInterval });

  return (
    <Slider
      ref={mergedRef}
      aria-label="Video player slider"
      {...props}
      onPointerDown={composeHandlers(onPointerDown, handlePointerDown)}
      onPointerMove={composeHandlers(onPointerMove, handlePointerMove)}
      onLostPointerCapture={composeHandlers(onLostPointerCapture, handleLostPointerCapture)}
      onKeyDown={composeHandlers(onKeyDown, handleKeyDown)}
      aria-valuemin={0}
      {...mediaDataAttrs}
    />
  );
}
