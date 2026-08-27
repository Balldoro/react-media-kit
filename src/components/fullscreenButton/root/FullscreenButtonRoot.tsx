import type { Ref } from "react";
import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { composeHandlers } from "@/utils/handlers";
import { setDataAttr } from "@/utils/attributes";
import { DATA_ATTRS } from "@/constants";
import type { ButtonAttributes } from "@/types";

interface FullscreenButtonRootProps extends ButtonAttributes {
  ref?: Ref<HTMLButtonElement>;
}

export function FullscreenButtonRoot({ onClick, ...props }: FullscreenButtonRootProps) {
  const { toggleFullscreen } = usePlayerControls();
  const mediaDataAttrs = useMediaAttributes();
  const isFullscreen = usePlayer((s) => s.isFullscreen);

  return (
    <button
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      {...props}
      type="button"
      onClick={composeHandlers(onClick, toggleFullscreen)}
      {...{ [DATA_ATTRS.fullscreen]: setDataAttr(isFullscreen) }}
      {...mediaDataAttrs}
    />
  );
}
