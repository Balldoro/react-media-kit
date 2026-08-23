import { useRef, type HTMLAttributes } from "react";
import { useVolume } from "./useVolume";
import { composeHandlers } from "@/utils/handlers";
import { Slider } from "@/components/common/Slider";
import { MAX_VOLUME, MIN_VOLUME, VOLUME_INTERVAL } from "@/constants";
import { useMediaGlobalProps } from "@/hooks/dataProps";

export interface VolumeSliderRootProps extends HTMLAttributes<HTMLDivElement> {
  volumeInterval?: number;
}

export function VolumeSlider({
  onPointerMove,
  onPointerDown,
  onKeyDown,
  volumeInterval = VOLUME_INTERVAL,
  ...props
}: VolumeSliderRootProps) {
  const sliderEl = useRef<HTMLDivElement>(null);
  const { volume, isMuted, handleKeyDown, handlePointerDown, handlePointerMove } = useVolume(
    sliderEl,
    { volumeInterval },
  );

  const currentVolume = isMuted ? 0 : volume;
  const currentVolumePercent = Math.round(currentVolume * 100);

  return (
    <Slider
      ref={sliderEl}
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
