import { usePlayer } from "@/state/PlayerContext";
import { shallow } from "@/state/shallow";
import { setDataAttr } from "@/utils/dom";
import { DATA_ATTRS } from "@/constants";

const selectMediaAttrsState = shallow((s) => ({
  state: s.state,
  featuresDetected: s.featuresDetected,
  supportsFullscreen: s.supportsFullscreen,
  supportsPiP: s.supportsPiP,
  supportsVolumeChange: s.supportsVolumeChange,
}));

export function useMediaAttributes() {
  const { state, featuresDetected, supportsFullscreen, supportsPiP, supportsVolumeChange } =
    usePlayer(selectMediaAttrsState);

  const isReady = state === "playable" && featuresDetected;

  return {
    [DATA_ATTRS.mediaPending]: setDataAttr(state === "pending"),
    [DATA_ATTRS.mediaLoading]: setDataAttr(state === "loading"),
    [DATA_ATTRS.mediaMetadataLoaded]: setDataAttr(state === "metadataloaded"),
    [DATA_ATTRS.mediaPlayable]: setDataAttr(state === "playable" && !isReady),
    [DATA_ATTRS.mediaReady]: setDataAttr(isReady),
    [DATA_ATTRS.mediaError]: setDataAttr(state === "error"),
    [DATA_ATTRS.fullscreenUnsupported]: setDataAttr(!supportsFullscreen),
    [DATA_ATTRS.pipUnsupported]: setDataAttr(!supportsPiP),
    [DATA_ATTRS.volumeChangeUnsupported]: setDataAttr(!supportsVolumeChange),
  };
}
