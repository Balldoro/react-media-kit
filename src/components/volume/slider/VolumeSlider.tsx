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
}

export function VolumeSlider({
  onPointerMove,
  onPointerDown,
  onKeyDown,
  volumeInterval = VOLUME_INTERVAL,
  ref,
  ...props
}: VolumeSliderRootProps) {
  const sliderEl = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(sliderEl, ref);
  const { volume, isMuted, handleKeyDown, handlePointerDown, handlePointerMove } = useVolume(
    sliderEl,
    { volumeInterval },
  );

  const currentVolume = isMuted ? 0 : volume;
  const currentVolumePercent = Math.round(currentVolume * 100);

  return (
    <Slider
      ref={mergedRef}
      aria-label="Video volume slider"
      {...props}
      aria-valuemin={MIN_VOLUME}
      aria-valuemax={MAX_VOLUME}
      aria-valuetext={`${currentVolumePercent}%`}
      aria-valuenow={currentVolume}
      onPointerMove={composeHandlers(onPointerMove, handlePointerMove)}
      onPointerDown={composeHandlers(onPointerDown, handlePointerDown)}
      onKeyDown={composeHandlers(onKeyDown, handleKeyDown)}
      data-ismuted={isMuted}
      {...useMediaGlobalProps()}
    />
  );
}
