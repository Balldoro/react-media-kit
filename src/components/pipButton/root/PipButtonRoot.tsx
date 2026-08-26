import type { Ref } from "react";
import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import { composeHandlers } from "@/utils/handlers";
import { setDataAttr } from "@/utils";
import { DATA_ATTRS } from "@/constants";
import type { ButtonAttributes } from "@/types";

interface PipButtonRootProps extends ButtonAttributes {
  ref?: Ref<HTMLButtonElement>;
}

export function PipButtonRoot({ onClick, ...props }: PipButtonRootProps) {
  const { togglePip } = usePlayerControls();
  const mediaDataAttrs = useMediaGlobalProps();
  const isPictureInPicture = usePlayer((s) => s.isPictureInPicture);

  return (
    <button
      aria-label={isPictureInPicture ? "Exit picture-in-picture" : "Enter picture-in-picture"}
      {...props}
      type="button"
      onClick={composeHandlers(onClick, togglePip)}
      {...{ [DATA_ATTRS.pip]: setDataAttr(isPictureInPicture) }}
      {...mediaDataAttrs}
    />
  );
}
