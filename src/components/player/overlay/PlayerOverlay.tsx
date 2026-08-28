import type { CSSProperties } from "react";
import {
  useOverlayInteractivity,
  type OverlayInteractivityOptions,
} from "./useOverlayInteractivity";
import { composeHandlers } from "@/utils/handlers";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import type { ButtonAttributes } from "@/types";
import { Button } from "@/components/common/Button";

interface PlayerOverlayProps extends Omit<ButtonAttributes, "onDoubleClick"> {
  label: string;
  onDoubleClick?: OverlayInteractivityOptions["onDoubleClick"];
  onDoubleTouch?: OverlayInteractivityOptions["onDoubleTouch"];
  doubleClickInterval?: number;
}

export function PlayerOverlay({
  style,
  label,
  onDoubleClick,
  onDoubleTouch,
  doubleClickInterval,
  onPointerDown,
  onPointerUp,
  onKeyDown,
  ...props
}: PlayerOverlayProps) {
  const mediaDataAttrs = useMediaAttributes();
  const { handlePointerDown, handlePointerUp, handleKeyDown } = useOverlayInteractivity({
    onPointerDown,
    onPointerUp,
    onDoubleClick,
    onDoubleTouch,
    doubleClickInterval,
  });

  return (
    <Button
      aria-label={label}
      style={{ ...style, ...requiredStyle }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onKeyDown={composeHandlers(onKeyDown, handleKeyDown)}
      {...props}
      // double click is handled internally onPointerDown, so onDoubleClick has to be no-op
      onDoubleClick={() => {}}
      {...mediaDataAttrs}
    />
  );
}

const requiredStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  touchAction: "manipulation",
};
