import type { CSSProperties } from "react";
import {
  useOverlayInteractivity,
  type OverlayInteractivityOptions,
} from "./useOverlayInteractivity";
import { composeHandlers } from "@/utils/handlers";
import type { ButtonAttributes } from "@/types";

interface VideoOverlayRootProps extends Omit<ButtonAttributes, "onDoubleClick"> {
  label: string;
  onDoubleClick?: OverlayInteractivityOptions["onDoubleClick"];
  onDoubleTouch?: OverlayInteractivityOptions["onDoubleTouch"];
  skipInterval?: number;
  doubleClickInterval?: number;
}

export function VideoOverlayRoot({
  style,
  label,
  onDoubleClick,
  onDoubleTouch,
  doubleClickInterval,
  skipInterval,
  onPointerDown,
  onPointerUp,
  onKeyDown,
  ...props
}: VideoOverlayRootProps) {
  const { handlePointerDown, handlePointerUp, handleKeyDown } = useOverlayInteractivity({
    onPointerDown,
    onPointerUp,
    onDoubleClick,
    onDoubleTouch,
    doubleClickInterval,
    skipInterval,
  });

  return (
    <button
      type="button"
      aria-label={label}
      style={{ ...adjustableStyle, ...style, ...requiredStyle }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onKeyDown={composeHandlers(onKeyDown, handleKeyDown)}
      {...props}
      // double click is handled internally onPointerDown, so onDoubleClick has to be no-op
      onDoubleClick={() => {}}
    />
  );
}

const adjustableStyle: CSSProperties = {
  background: "transparent",
  border: "none",
};

const requiredStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  touchAction: "manipulation",
};
