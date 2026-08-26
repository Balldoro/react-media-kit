import { useRef, type CSSProperties, type HTMLAttributes, type Ref } from "react";
import { useMediaGlobalProps } from "@/hooks/dataProps";
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
  style,
  skipInterval = SKIP_INTERVAL,
  ref,
  onKeyDown,
  onPointerMove,
  onPointerDown,
  ...props
}: SeekbarRootProps) {
  const sliderEl = useRef<HTMLDivElement>(null);

  useSeekbarTime(sliderEl);
  useBufferTime(sliderEl);

  const mergedRef = useMergeRefs(sliderEl, ref);
  const { handlePointerDown, handlePointerMove, handleKeyDown } = useSeekbarInteractivity(
    sliderEl,
    { skipInterval },
  );

  return (
    <Slider
      ref={mergedRef}
      aria-label="Video player slider"
      style={{ ...defaultStyle, ...style }}
      {...props}
      onPointerDown={composeHandlers(onPointerDown, handlePointerDown)}
      onPointerMove={composeHandlers(onPointerMove, handlePointerMove)}
      onKeyDown={composeHandlers(onKeyDown, handleKeyDown)}
      aria-valuemin={0}
      {...useMediaGlobalProps()}
    />
  );
}

const defaultStyle: CSSProperties = {
  // TODO: Those are hardcoded sane values that prevent Thumb from overflowing. This would make use of ResizeObserver attached
  // to the Thumb element to dynamically calculate it, as consumer applies his own, custom width
  paddingLeft: 6,
  paddingRight: 6,
};
