import { usePlayer } from "@/state/PlayerContext";
import { useShallow } from "@/utils/useShallow";

const MEDIA_READY_ATTR = "data-media-ready";
const MEDIA_ERROR_ATTR = "data-media-error";

export function useMediaGlobalProps() {
  const { isReady, isError } = usePlayer(
    useShallow((s) => ({ isReady: s.isReady, isError: s.isError })),
  );

  return { [MEDIA_READY_ATTR]: isReady, [MEDIA_ERROR_ATTR]: isError };
}
