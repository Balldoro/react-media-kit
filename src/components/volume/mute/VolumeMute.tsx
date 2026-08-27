import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { composeHandlers } from "@/utils/handlers";
import { setDataAttr } from "@/utils/attributes";
import { DATA_ATTRS } from "@/constants";
import type { Ref } from "react";
import type { ButtonAttributes } from "@/types";

interface VolumeMuteProps extends ButtonAttributes {
  ref?: Ref<HTMLButtonElement>;
}

export function VolumeMute({ onClick, ...props }: VolumeMuteProps) {
  const { toggleMute } = usePlayerControls();
  const mediaDataAttrs = useMediaAttributes();
  const isMuted = usePlayer((s) => s.isMuted);

  return (
    <button
      aria-label={isMuted ? "Unmute video" : "Mute video"}
      {...props}
      type="button"
      onClick={composeHandlers(onClick, toggleMute)}
      {...{ [DATA_ATTRS.muted]: setDataAttr(isMuted) }}
      {...mediaDataAttrs}
    />
  );
}
