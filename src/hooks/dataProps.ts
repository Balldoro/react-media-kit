import { usePlayer } from "@/state/PlayerContext";
import { setDataAttr } from "@/utils";
import { DATA_ATTRS } from "@/constants";

export function useMediaGlobalProps() {
  const state = usePlayer((s) => s.state);

  return {
    [DATA_ATTRS.mediaPending]: setDataAttr(state === "pending"),
    [DATA_ATTRS.mediaLoading]: setDataAttr(state === "loading"),
    [DATA_ATTRS.mediaReady]: setDataAttr(state === "ready"),
    [DATA_ATTRS.mediaError]: setDataAttr(state === "error"),
  };
}
