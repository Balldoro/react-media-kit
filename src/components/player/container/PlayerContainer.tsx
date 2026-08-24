import type { HTMLAttributes, KeyboardEvent, Ref } from "react";
import { usePlayerControls, usePlayerCtx } from "@/state/PlayerContext";
import { composeHandlers } from "@/utils/handlers";
import { useMergeRefs } from "@/hooks/useMergeRefs";

interface PlayerContainerProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function PlayerContainer({ onKeyDown, style, ref, ...props }: PlayerContainerProps) {
  const { containerEl } = usePlayerCtx();
  const mergedRef = useMergeRefs(containerEl, ref);
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
      ref={mergedRef}
      style={{ ...style, position: "relative" }}
      {...props}
      onKeyDown={composeHandlers(onKeyDown, handleKeyDown)}
    />
  );
}
