import { usePlayer } from "@/state/PlayerContext";
import { shallow } from "@/utils";

const MEDIA_READY_ATTR = "data-media-ready";
const MEDIA_ERROR_ATTR = "data-media-error";

export function useMediaGlobalProps() {
  const { isReady, isError } = usePlayer(
    shallow((s) => ({ isReady: s.isReady, isError: s.isError })),
  );

  return { [MEDIA_READY_ATTR]: isReady, [MEDIA_ERROR_ATTR]: isError };
}
