import type { CSSProperties, HTMLAttributes } from "react";
import {
  useOverlayInteractivity,
  type OverlayInteractivityOptions,
} from "./useOverlayInteractivity";
import { composeHandlers } from "@/utils/handlers";

interface VideoOverlayRootProps extends Omit<HTMLAttributes<HTMLButtonElement>, "onDoubleClick"> {
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
      style={{ ...defaultStyle, ...style }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onKeyDown={composeHandlers(onKeyDown, handleKeyDown)}
      {...props}
      // double click is handled internally onPointerDown, so onDoubleClick has to be no-op
      onDoubleClick={() => {}}
    />
  );
}

const defaultStyle: CSSProperties = {
  position: "absolute",
  padding: 0,
  inset: 0,
  zIndex: 10,
  background: "transparent",
  border: "none",
  touchAction: "manipulation",
  userSelect: "none",
};
