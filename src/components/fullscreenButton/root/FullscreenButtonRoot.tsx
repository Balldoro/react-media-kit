import type { ReactNode } from "react";
import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import { composeHandlers } from "@/utils/handlers";
import type { ButtonAttributes } from "@/types";

interface FullscreenButtonRootProps extends Omit<ButtonAttributes, "children"> {
  children?: ReactNode | ((props: { isFullscreen: boolean }) => ReactNode);
}

export function FullscreenButtonRoot({ onClick, children, ...props }: FullscreenButtonRootProps) {
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
    >
      {typeof children === "function" ? children({ isFullscreen }) : children}
    </button>
  );
}
