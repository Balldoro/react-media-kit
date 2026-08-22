import { usePlayer } from "@/state/usePlayer";

const MEDIA_READY_ATTR = "data-media-ready";

export function useMediaReadyProps() {
  const isReady = usePlayer((s) => s.isReady);
  return { [MEDIA_READY_ATTR]: isReady };
}
