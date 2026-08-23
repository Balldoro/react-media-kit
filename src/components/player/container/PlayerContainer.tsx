import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { usePlayerControls, usePlayerCtx } from "@/state/PlayerContext";
import { composeHandlers } from "@/utils/handlers";

interface PlayerContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PlayerContainer({ onKeyDown, children, style, ...props }: PlayerContainerProps) {
  const { containerEl } = usePlayerCtx();
  const { toggleMute, toggleFullscreen } = usePlayerControls();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    switch (e.key.toUpperCase()) {
      case "M":
        return toggleMute();
      case "F":
        return toggleFullscreen();
    }
  };

  return (
    <div
      ref={containerEl}
      style={{ ...style, position: "relative" }}
      {...props}
      onKeyDown={composeHandlers(onKeyDown, handleKeyDown)}
    >
      {children}
    </div>
  );
}
