import { createContext, use, useSyncExternalStore, type RefObject } from "react";
import { type PlayerStore } from "@/state/store";
import type { Selector } from "./types";

interface PlayerContextValue extends PlayerStore {
  containerEl: RefObject<HTMLDivElement | null>;
  videoEl: RefObject<HTMLVideoElement | null>;
  lang?: string;
}

export const PlayerContext = createContext<PlayerContextValue | null>(null);

export const usePlayerSubscription = () => {
  const ctx = use(PlayerContext);

  if (!ctx) {
    throw new Error("usePlayerSubscription used outside of the PlayerProvider!");
  }

  return ctx;
};

export const usePlayerCtx = () => {
  const ctx = use(PlayerContext);

  if (!ctx) {
    throw new Error("usePlayerCtx used outside of the PlayerProvider!");
  }

  const { lang, videoEl, containerEl } = ctx;
  return { lang, videoEl, containerEl };
};

export function usePlayer<T>(selector: Selector<T>) {
  const { subscribe, getSnapshot } = usePlayerSubscription();
  return useSyncExternalStore(subscribe, () => selector(getSnapshot()));
}

export function usePlayerControls() {
  const { getControls } = usePlayerSubscription();
  return getControls();
}
