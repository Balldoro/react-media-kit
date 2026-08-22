import { usePlayer, usePlayerControls } from "@/state/usePlayer";
import { composeHandlers } from "@/utils/handlers";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface VolumeMuteProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  children: ReactNode | ((props: { isMuted: boolean; volume: number }) => ReactNode);
}

export function VolumeMute({ onClick, children, ...props }: VolumeMuteProps) {
  const { toggleMute } = usePlayerControls();
  const isMuted = usePlayer((s) => s.isMuted);
  const volume = usePlayer((s) => s.volume);

  return (
    <button
      {...props}
      type="button"
      aria-pressed={isMuted}
      onClick={composeHandlers(onClick, toggleMute)}
    >
      {typeof children === "function" ? children({ isMuted, volume }) : children}
    </button>
  );
}
