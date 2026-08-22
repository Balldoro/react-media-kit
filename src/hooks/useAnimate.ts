import { usePlayerSubscription } from "@/state/usePlayer";
import { useEffect, useEffectEvent } from "react";

interface Config {
  draw: () => void;
  intervalMs: number;
  isActive: boolean;
}

export function useAnimate({ draw: onDraw, isActive, intervalMs }: Config) {
  const { subscribe } = usePlayerSubscription();

  const draw = useEffectEvent(onDraw);

  useEffect(() => {
    let animateFrame: number | null = null;
    let prevTime = 0;

    const animate = (time: number) => {
      const deltaTime = time - prevTime;
      if (deltaTime >= intervalMs) {
        draw();
        prevTime = time;
      }
      animateFrame = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (animateFrame !== null) return;
      prevTime = 0;
      animateFrame = requestAnimationFrame(animate);
    };

    const stopLoop = () => {
      if (animateFrame === null) return;
      cancelAnimationFrame(animateFrame);
      animateFrame = null;
    };

    const unsubscribe = subscribe(() => {
      if (isActive) {
        startLoop();
      } else {
        stopLoop();
        draw();
      }
    });

    if (isActive) startLoop();

    return () => {
      unsubscribe();
      stopLoop();
    };
  }, [intervalMs, isActive, subscribe]);
}
