import { usePlayerCtx } from "@/state/PlayerContext";
import { useImperativeHandle, useRef, type Ref } from "react";
import { useMergeRefs } from "@/hooks/useMergeRefs";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { useMediaEngine } from "@/hooks/useMediaEngine";
import type { MediaEngine } from "@/types";

export interface MediaElementOptions<T extends HTMLMediaElement> {
  attachEngine?: MediaEngine<T>;
  ref?: Ref<T>;
}

// An engine attaches after `src` and overwrites it, but that ordering isn't guaranteed, so passing both is unsupported.
export type MediaElementProps<T extends HTMLMediaElement> = { ref?: Ref<T> } & (
  { attachEngine?: never; src?: string } | { attachEngine: MediaEngine<T>; src?: never }
);

export function useMediaElement<T extends HTMLMediaElement>({
  ref,
  attachEngine,
}: MediaElementOptions<T>) {
  const { attachMedia } = usePlayerCtx();
  const { setMedia } = useMediaEngine(attachEngine);

  const internalRef = useRef<T>(null);
  useImperativeHandle(ref, () => internalRef.current!, []);

  const mediaRef = useMergeRefs<T>(attachMedia, setMedia, internalRef);
  const mediaDataAttrs = useMediaAttributes();

  return { mediaRef, mediaDataAttrs };
}
