import { usePlayer } from "@/state/PlayerContext";
import { setDataAttr } from "@/utils/dom";
import { DATA_ATTRS } from "@/constants";

export function useMediaAttributes() {
  const state = usePlayer((s) => s.state);
  const supportsFullscreen = usePlayer((s) => s.supportsFullscreen);
  const supportsPiP = usePlayer((s) => s.supportsPiP);
  const supportsVolumeChange = usePlayer((s) => s.supportsVolumeChange);

  return {
    [DATA_ATTRS.mediaPending]: setDataAttr(state === "pending"),
    [DATA_ATTRS.mediaLoading]: setDataAttr(state === "loading"),
    [DATA_ATTRS.mediaMetadataLoaded]: setDataAttr(state === "metadataloaded"),
    [DATA_ATTRS.mediaReady]: setDataAttr(state === "ready"),
    [DATA_ATTRS.mediaError]: setDataAttr(state === "error"),
    [DATA_ATTRS.fullscreenUnsupported]: setDataAttr(!supportsFullscreen),
    [DATA_ATTRS.pipUnsupported]: setDataAttr(!supportsPiP),
    [DATA_ATTRS.volumeChangeUnsupported]: setDataAttr(!supportsVolumeChange),
  };
}
