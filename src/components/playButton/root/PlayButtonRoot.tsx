import type { Ref } from "react";
import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { composeHandlers } from "@/utils/handlers";
import { setDataAttr } from "@/utils/dom";
import { DATA_ATTRS } from "@/constants";
import type { ButtonAttributes } from "@/types";
import { Button } from "@/components/common/Button";

interface PlayButtonRootProps extends ButtonAttributes {
  ref?: Ref<HTMLButtonElement>;
}

export function PlayButtonRoot({ onClick, ...props }: PlayButtonRootProps) {
  const { toggle } = usePlayerControls();
  const mediaDataAttrs = useMediaAttributes();
  const isPlaying = usePlayer((s) => s.isPlaying);

  return (
    <Button
      aria-label={isPlaying ? "Pause video" : "Play video"}
      {...props}
      onClick={composeHandlers(onClick, toggle)}
      {...{ [DATA_ATTRS.playing]: setDataAttr(isPlaying) }}
      {...mediaDataAttrs}
    />
  );
}
