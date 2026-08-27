import { createContext, use, useSyncExternalStore, type RefObject } from "react";
import { initialState, type PlayerStore } from "@/state/store";
import type { Selector } from "./types";

interface PlayerContextValue extends PlayerStore {
  containerEl: RefObject<HTMLDivElement | null>;
  mediaEl: RefObject<HTMLMediaElement | null>;
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

  const { lang, mediaEl, containerEl } = ctx;
  return { lang, mediaEl, containerEl };
};

export function usePlayer<T>(selector: Selector<T>) {
  const { subscribe, getSnapshot } = usePlayerSubscription();
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(initialState),
  );
}

export function usePlayerControls() {
  const { controls } = usePlayerSubscription();
  return controls;
}
