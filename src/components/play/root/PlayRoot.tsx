import type { ButtonHTMLAttributes, ReactNode } from "react";
import { usePlayer, usePlayerControls } from "@/state/usePlayer";
import { composeHandlers } from "@/utils/handlers";

interface PlayRootProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode | ((props: { isPlaying: boolean }) => ReactNode);
}

export function PlayRoot({ onClick, children, ...props }: PlayRootProps) {
  const { toggle } = usePlayerControls();
  const isPlaying = usePlayer((s) => s.isPlaying);

  return (
    <button
      {...props}
      type="button"
      onClick={composeHandlers(onClick, toggle)}
      data-isplaying={isPlaying}
    >
      {typeof children === "function" ? children({ isPlaying }) : children}
    </button>
  );
}
