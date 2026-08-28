import type { Ref } from "react";
import { usePlayer, usePlayerControls } from "@/state/PlayerContext";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { composeHandlers } from "@/utils/handlers";
import { setDataAttr } from "@/utils/attributes";
import { DATA_ATTRS } from "@/constants";
import type { ButtonAttributes } from "@/types";
import { Button } from "@/components/common/Button";

interface PipButtonRootProps extends ButtonAttributes {
  ref?: Ref<HTMLButtonElement>;
}

export function PipButtonRoot({ onClick, ...props }: PipButtonRootProps) {
  const { togglePip } = usePlayerControls();
  const mediaDataAttrs = useMediaAttributes();
  const isPictureInPicture = usePlayer((s) => s.isPictureInPicture);

  return (
    <Button
      aria-label={isPictureInPicture ? "Exit picture-in-picture" : "Enter picture-in-picture"}
      {...props}
      onClick={composeHandlers(onClick, togglePip)}
      {...{ [DATA_ATTRS.pip]: setDataAttr(isPictureInPicture) }}
      {...mediaDataAttrs}
    />
  );
}
