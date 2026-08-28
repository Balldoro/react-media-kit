import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { composeHandlers } from "@/utils/handlers";
import { setDataAttr } from "@/utils/dom";
import { DATA_ATTRS } from "@/constants";
import type { Ref } from "react";
import type { ButtonAttributes } from "@/types";
import { Button } from "@/components/common/Button";

interface VolumeMuteProps extends ButtonAttributes {
  ref?: Ref<HTMLButtonElement>;
}

export function VolumeMute({ onClick, ...props }: VolumeMuteProps) {
  const { toggleMute } = usePlayerControls();
  const mediaDataAttrs = useMediaAttributes();
  const isMuted = usePlayer((s) => s.isMuted);

  return (
    <Button
      aria-label={isMuted ? "Unmute video" : "Mute video"}
      {...props}
      onClick={composeHandlers(onClick, toggleMute)}
      {...{ [DATA_ATTRS.muted]: setDataAttr(isMuted) }}
      {...mediaDataAttrs}
    />
  );
}
