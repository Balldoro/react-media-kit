import { usePlayerSubscription } from "@/state/PlayerContext";
import { useEffect, useEffectEvent } from "react";

interface Config {
  draw: () => void;
  intervalMs: number;
}

export function useAnimateOnPlay({ draw: onDraw, intervalMs }: Config) {
  const { subscribe, subscribeWithSelector, getSnapshot } = usePlayerSubscription();
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
      prevTime = 0;
      animateFrame = requestAnimationFrame(animate);
    };

    const stopLoop = () => {
      if (animateFrame === null) return;
      cancelAnimationFrame(animateFrame);
      animateFrame = null;
    };

    const unsubscribe = subscribeWithSelector(
      (s) => s.isPlaying,
      (isPlaying) => {
        if (isPlaying) startLoop();
        else {
          stopLoop();
          draw();
        }
      },
    );

    // Subscribe to each event as well with draw function so that it fires on seeking as well
    const unsubscribeAny = subscribe(() => !getSnapshot().isPlaying && draw());

    if (getSnapshot().isPlaying) startLoop();
    else draw();

    return () => {
      unsubscribe();
      unsubscribeAny();
      stopLoop();
    };
  }, [intervalMs, getSnapshot, subscribe, subscribeWithSelector]);
}
