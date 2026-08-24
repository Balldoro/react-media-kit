import { useRef, type HTMLAttributes, type Ref } from "react";
import { useVolume } from "./useVolume";
import { composeHandlers } from "@/utils/handlers";
import { Slider } from "@/components/common/Slider";
import { MAX_VOLUME, MIN_VOLUME, VOLUME_INTERVAL } from "@/constants";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import { useMergeRefs } from "@/hooks/useMergeRefs";

export interface VolumeSliderRootProps extends HTMLAttributes<HTMLDivElement> {
  volumeInterval?: number;
  ref?: Ref<HTMLDivElement>;
  computeAriaValueText?: ({ volume, isMuted }: { volume: number; isMuted: boolean }) => string;
}

export function VolumeSlider({
  volumeInterval = VOLUME_INTERVAL,
  ref,
  onPointerMove,
  onPointerDown,
  onKeyDown,
  computeAriaValueText,
  ...props
}: VolumeSliderRootProps) {
  const sliderEl = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(sliderEl, ref);
  const { handleKeyDown, handlePointerDown, handlePointerMove } = useVolume(sliderEl, {
    volumeInterval,
    computeAriaValueText,
  });

  return (
    <Slider
      ref={mergedRef}
      aria-label="Video volume slider"
      {...props}
      aria-valuemin={MIN_VOLUME}
      aria-valuemax={MAX_VOLUME}
      onPointerMove={composeHandlers(onPointerMove, handlePointerMove)}
      onPointerDown={composeHandlers(onPointerDown, handlePointerDown)}
      onKeyDown={composeHandlers(onKeyDown, handleKeyDown)}
      {...useMediaGlobalProps()}
    />
  );
}
