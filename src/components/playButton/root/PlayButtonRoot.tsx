import type { Ref } from "react";
import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import { composeHandlers } from "@/utils/handlers";
import type { ButtonAttributes } from "@/types";

interface PlayButtonRootProps extends ButtonAttributes {
  ref?: Ref<HTMLButtonElement>;
}

export function PlayButtonRoot({ onClick, ...props }: PlayButtonRootProps) {
  const { toggle } = usePlayerControls();
  const isPlaying = usePlayer((s) => s.isPlaying);

  return (
    <button
      aria-label={isPlaying ? "Pause video" : "Play video"}
      {...props}
      type="button"
      onClick={composeHandlers(onClick, toggle)}
      data-isplaying={isPlaying}
      {...useMediaGlobalProps()}
    />
  );
}
