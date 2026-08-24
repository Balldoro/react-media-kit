import type { Ref } from "react";
import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import { composeHandlers } from "@/utils/handlers";
import type { ButtonAttributes } from "@/types";

interface PipButtonRootProps extends ButtonAttributes {
  ref?: Ref<HTMLButtonElement>;
}

export function PipButtonRoot({ onClick, ...props }: PipButtonRootProps) {
  const { togglePip } = usePlayerControls();
  const isPictureInPicture = usePlayer((s) => s.isPictureInPicture);

  return (
    <button
      aria-label={isPictureInPicture ? "Exit picture-in-picture" : "Enter picture-in-picture"}
      {...props}
      type="button"
      onClick={composeHandlers(onClick, togglePip)}
      data-ispictureinpicture={isPictureInPicture}
      {...useMediaGlobalProps()}
    />
  );
}
