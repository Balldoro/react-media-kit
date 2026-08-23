import { createPlayerStore, type PlayerStore } from "@/state/store";
import { PlayerContext } from "@/state/PlayerContext";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

interface PlayerRootProps {
  children: ReactNode;
  lang?: string;
}

export const PlayerRoot = ({ children, lang }: PlayerRootProps) => {
  const [state] = useState<PlayerStore>(createPlayerStore);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!videoRef.current || !containerRef.current) return;

    state.init(videoRef.current, containerRef.current);
    return state.destroy;
  }, [state]);

  const value = useMemo(
    () => ({ ...state, videoEl: videoRef, containerEl: containerRef, lang }),
    [state, lang],
  );

  return <PlayerContext value={value}>{children}</PlayerContext>;
};
