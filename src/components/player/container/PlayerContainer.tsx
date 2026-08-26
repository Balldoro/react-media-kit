import type { HTMLAttributes, KeyboardEvent, Ref } from "react";
import { usePlayer, usePlayerControls, usePlayerCtx } from "@/state/PlayerContext";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import { composeHandlers } from "@/utils/handlers";
import { setDataAttr } from "@/utils";
import { DATA_ATTRS } from "@/constants";
import { useMergeRefs } from "@/hooks/useMergeRefs";

interface PlayerContainerProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function PlayerContainer({ onKeyDown, style, ref, ...props }: PlayerContainerProps) {
  const { containerEl } = usePlayerCtx();
  const mergedRef = useMergeRefs(containerEl, ref);
  const mediaDataAttrs = useMediaGlobalProps();
  const { toggleMute, toggleFullscreen } = usePlayerControls();
  const isFullscreen = usePlayer((s) => s.isFullscreen);
  const isPictureInPicture = usePlayer((s) => s.isPictureInPicture);

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
      {...{
        [DATA_ATTRS.fullscreen]: setDataAttr(isFullscreen),
        [DATA_ATTRS.pip]: setDataAttr(isPictureInPicture),
      }}
      {...mediaDataAttrs}
    />
  );
}
