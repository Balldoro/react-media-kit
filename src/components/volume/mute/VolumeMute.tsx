import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import { composeHandlers } from "@/utils/handlers";
import type { ReactNode, Ref } from "react";
import type { ButtonAttributes } from "@/types";

interface VolumeMuteProps extends Omit<ButtonAttributes, "children"> {
  children: ReactNode | ((props: { isMuted: boolean; volume: number }) => ReactNode);
  ref?: Ref<HTMLButtonElement>;
}

export function VolumeMute({ onClick, children, ...props }: VolumeMuteProps) {
  const { toggleMute } = usePlayerControls();
  const isMuted = usePlayer((s) => s.isMuted);
  const volume = usePlayer((s) => s.volume);

  return (
    <button
      aria-label={isMuted ? "Unmute video" : "Mute video"}
      {...props}
      type="button"
      onClick={composeHandlers(onClick, toggleMute)}
      {...useMediaGlobalProps()}
    >
      {typeof children === "function" ? children({ isMuted, volume }) : children}
    </button>
  );
}
