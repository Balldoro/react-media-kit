import { createContext, use, useSyncExternalStore } from "react";
import { initialState, type PlayerStore } from "@/state/store";
import type { Selector } from "./types";
import { ReactMediaKitError } from "@/utils/errors";

interface PlayerContextValue extends PlayerStore {
  lang?: string;
}

export const PlayerContext = createContext<PlayerContextValue | null>(null);

export const usePlayerSubscription = () => {
  const ctx = use(PlayerContext);

  if (!ctx) {
    throw new ReactMediaKitError("usePlayerSubscription used outside of the PlayerProvider!");
  }

  return ctx;
};

export const usePlayerCtx = () => {
  const ctx = use(PlayerContext);

  if (!ctx) {
    throw new ReactMediaKitError("usePlayerCtx used outside of the PlayerProvider!");
  }

  const { lang, attachMedia, attachContainer, getMedia, getContainer } = ctx;
  return { lang, attachMedia, attachContainer, getMedia, getContainer };
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
