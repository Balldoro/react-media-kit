import { usePlayer, usePlayerControls } from "@/state/usePlayer";
import { useMediaReadyProps } from "@/hooks/dataProps";
import { composeHandlers } from "@/utils/handlers";
import type { ReactNode } from "react";
import type { ButtonAttributes } from "@/types";

interface VolumeMuteProps extends Omit<ButtonAttributes, "children"> {
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
      {...useMediaReadyProps()}
    >
      {typeof children === "function" ? children({ isMuted, volume }) : children}
    </button>
  );
}
