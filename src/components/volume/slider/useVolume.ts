import { MAX_VOLUME, MIN_VOLUME } from "@/constants";
import { usePlayer, usePlayerControls } from "@/state/usePlayer";
import { handleNavKeyDown } from "@/utils/handlers";
import { clampVolume } from "@/utils/volume";
import {
  useEffect,
  useRef,
  type KeyboardEventHandler,
  type PointerEventHandler,
  type RefObject,
} from "react";

interface Config {
  volumeInterval: number;
}

export function useVolume(sliderEl: RefObject<HTMLDivElement | null>, { volumeInterval }: Config) {
  const volume = usePlayer((s) => s.volume);
  const isMuted = usePlayer((s) => s.isMuted);

  const sliderRect = useRef<DOMRect>(null);
  const { stepVolume, setVolume } = usePlayerControls();

  useEffect(() => {
    if (!sliderEl.current) return;

    const currentVolumePercentage = isMuted ? 0 : volume * 100;
    sliderEl.current.style.setProperty("--progress-percent", String(currentVolumePercentage));
  }, [sliderEl, volume, isMuted]);

  function updateVolume(clickX: number) {
    if (!sliderRect.current) return;

    const { left, width } = sliderRect.current;
    const containerPos = clampVolume((clickX - left) / width);

    sliderEl.current?.style.setProperty("--progress-percent", String(containerPos * 100));
    setVolume(containerPos);
  }

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!sliderEl.current) return;

    sliderRect.current = sliderEl.current.getBoundingClientRect();
    sliderEl.current.setPointerCapture(e.pointerId);
    updateVolume(e.clientX);
  };

  const handlePointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (!sliderEl.current || !sliderEl.current.hasPointerCapture(e.pointerId)) return;

    updateVolume(e.clientX);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) =>
    handleNavKeyDown(e, {
      onBack: () => stepVolume(-volumeInterval),
      onNext: () => stepVolume(volumeInterval),
      onStart: () => setVolume(MIN_VOLUME),
      onEnd: () => setVolume(MAX_VOLUME),
    });

  return { volume, isMuted, handlePointerDown, handlePointerMove, handleKeyDown };
}
