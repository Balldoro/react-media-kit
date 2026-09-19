import type { MediaEngine } from "@/types";
import { useEffect, useEffectEvent, useState } from "react";

export function useMediaEngine<T extends HTMLMediaElement>(engine?: MediaEngine<T>) {
  const [media, setMedia] = useState<T | null>(null);

  const attachEngine = useEffectEvent((media: T) => engine?.(media));

  const hasEngine = typeof engine === "function";

  useEffect(() => {
    if (!media || !hasEngine) return;

    const detachEngine = attachEngine(media);
    return detachEngine;
  }, [media, hasEngine]);

  return { setMedia };
}
