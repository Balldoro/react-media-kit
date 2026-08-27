import type { HTMLAttributes, KeyboardEvent, Ref } from "react";
import { usePlayer, usePlayerControls, usePlayerCtx } from "@/state/PlayerContext";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { composeHandlers, normalizeKeyCode } from "@/utils/handlers";
import { setDataAttr } from "@/utils/attributes";
import { DATA_ATTRS, KEY_NAMES, SKIP_INTERVAL, VOLUME_INTERVAL } from "@/constants";
import { useMergeRefs } from "@/hooks/useMergeRefs";

export const NATIVE_ACTIVATION_TAGS = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]);

interface PlayerContainerProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  skipInterval?: number;
  volumeInterval?: number;
}

export function PlayerContainer({
  onKeyDown,
  style,
  ref,
  skipInterval = SKIP_INTERVAL,
  volumeInterval = VOLUME_INTERVAL,
  ...props
}: PlayerContainerProps) {
  const { attachContainer } = usePlayerCtx();
  const { toggle, toggleMute, toggleFullscreen, skip, stepVolume } = usePlayerControls();
  const mergedRef = useMergeRefs(attachContainer, ref);
  const mediaDataAttrs = useMediaAttributes();
  const isFullscreen = usePlayer((s) => s.isFullscreen);
  const isPictureInPicture = usePlayer((s) => s.isPictureInPicture);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.defaultPrevented) return;

    const key = normalizeKeyCode(e.key);
    const isActivationKey = key === KEY_NAMES.SPACE || key === KEY_NAMES.ENTER;
    if (isActivationKey && NATIVE_ACTIVATION_TAGS.has((e.target as HTMLElement).tagName)) return;

    switch (key) {
      case KEY_NAMES.SPACE:
      case KEY_NAMES.ENTER:
        e.preventDefault();
        return toggle();
      case KEY_NAMES.ARROW_LEFT:
        e.preventDefault();
        return skip(-skipInterval);
      case KEY_NAMES.ARROW_RIGHT:
        e.preventDefault();
        return skip(skipInterval);
      case KEY_NAMES.ARROW_UP:
        e.preventDefault();
        return stepVolume(volumeInterval);
      case KEY_NAMES.ARROW_DOWN:
        e.preventDefault();
        return stepVolume(-volumeInterval);
      case KEY_NAMES.MUTE:
        return toggleMute();
      case KEY_NAMES.FULLSCREEN:
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
