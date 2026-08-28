import { Button } from "@/components/common/Button";
import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { composeHandlers } from "@/utils/handlers";
import { setDataAttr } from "@/utils/dom";
import { DATA_ATTRS } from "@/constants";
import type { ButtonAttributes } from "@/types";

interface FullscreenButtonRootProps extends ButtonAttributes {}

export function FullscreenButtonRoot({ onClick, ...props }: FullscreenButtonRootProps) {
  const { toggleFullscreen } = usePlayerControls();
  const mediaDataAttrs = useMediaAttributes();
  const isFullscreen = usePlayer((s) => s.isFullscreen);

  return (
    <Button
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      {...props}
      onClick={composeHandlers(onClick, toggleFullscreen)}
      {...{ [DATA_ATTRS.fullscreen]: setDataAttr(isFullscreen) }}
      {...mediaDataAttrs}
    />
  );
}
