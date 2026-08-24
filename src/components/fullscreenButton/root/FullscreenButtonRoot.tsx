import type { Ref } from "react";
import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import { composeHandlers } from "@/utils/handlers";
import type { ButtonAttributes } from "@/types";

interface FullscreenButtonRootProps extends ButtonAttributes {
  ref?: Ref<HTMLButtonElement>;
}

export function FullscreenButtonRoot({ onClick, ...props }: FullscreenButtonRootProps) {
  const { toggleFullscreen } = usePlayerControls();
  const isFullscreen = usePlayer((s) => s.isFullscreen);

  return (
    <button
      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      {...props}
      type="button"
      onClick={composeHandlers(onClick, toggleFullscreen)}
      data-isfullscreen={isFullscreen}
      {...useMediaGlobalProps()}
    />
  );
}
