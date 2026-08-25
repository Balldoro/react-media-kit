import { usePlayer } from "@/state/PlayerContext";

const MEDIA_READY_ATTR = "data-media-ready";
const MEDIA_ERROR_ATTR = "data-media-error";
const MEDIA_LOADING_ATTR = "data-media-loading";
const MEDIA_PENDING_ATTR = "data-media-pending";

export function useMediaGlobalProps() {
  const state = usePlayer((s) => s.state);

  return {
    [MEDIA_PENDING_ATTR]: state === "pending",
    [MEDIA_LOADING_ATTR]: state === "loading",
    [MEDIA_READY_ATTR]: state === "ready",
    [MEDIA_ERROR_ATTR]: state === "error",
  };
}
