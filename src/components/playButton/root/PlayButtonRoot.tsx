import type { ReactNode } from "react";
import { usePlayer, usePlayerControls } from "@/state/usePlayer";
import { useMediaReadyProps } from "@/hooks/dataProps";
import { composeHandlers } from "@/utils/handlers";
import type { ButtonAttributes } from "@/types";

interface PlayButtonRootProps extends Omit<ButtonAttributes, "children"> {
  children: ReactNode | ((props: { isPlaying: boolean }) => ReactNode);
}

export function PlayButtonRoot({ onClick, children, ...props }: PlayButtonRootProps) {
  const { toggle } = usePlayerControls();
  const isPlaying = usePlayer((s) => s.isPlaying);

  return (
    <button
      aria-label={isPlaying ? "Pause video" : "Play video"}
      {...props}
      type="button"
      onClick={composeHandlers(onClick, toggle)}
      data-isplaying={isPlaying}
      {...useMediaReadyProps()}
    >
      {typeof children === "function" ? children({ isPlaying }) : children}
    </button>
  );
}
