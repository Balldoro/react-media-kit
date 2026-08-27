import { useRef, type HTMLAttributes, type Ref } from "react";
import { useVolume } from "./useVolume";
import { composeHandlers } from "@/utils/handlers";
import { Slider } from "@/components/common/Slider";
import { MAX_VOLUME, MIN_VOLUME, VOLUME_INTERVAL } from "@/constants";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { useMergeRefs } from "@/hooks/useMergeRefs";

export interface VolumeSliderRootProps extends HTMLAttributes<HTMLDivElement> {
  volumeInterval?: number;
  ref?: Ref<HTMLDivElement>;
  computeAriaValueText?: ({ volume, isMuted }: { volume: number; isMuted: boolean }) => string;
}

export function VolumeSlider({
  volumeInterval = VOLUME_INTERVAL,
  ref,
  onPointerDown,
  onPointerMove,
  onLostPointerCapture,
  onKeyDown,
  computeAriaValueText,
  ...props
}: VolumeSliderRootProps) {
  const sliderEl = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(sliderEl, ref);
  const mediaDataAttrs = useMediaAttributes();
  const { handleKeyDown, handlePointerDown, handlePointerMove, handleLostPointerCapture } =
    useVolume(sliderEl, { volumeInterval, computeAriaValueText });

  return (
    <Slider
      ref={mergedRef}
      aria-label="Video volume slider"
      {...props}
      aria-valuemin={MIN_VOLUME}
      aria-valuemax={MAX_VOLUME}
      onPointerMove={composeHandlers(onPointerMove, handlePointerMove)}
      onPointerDown={composeHandlers(onPointerDown, handlePointerDown)}
      onLostPointerCapture={composeHandlers(onLostPointerCapture, handleLostPointerCapture)}
      onKeyDown={composeHandlers(onKeyDown, handleKeyDown)}
      {...mediaDataAttrs}
    />
  );
}
