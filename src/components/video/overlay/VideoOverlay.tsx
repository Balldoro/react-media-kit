import type { CSSProperties, Ref } from "react";
import {
  useOverlayInteractivity,
  type OverlayInteractivityOptions,
} from "./useOverlayInteractivity";
import { composeHandlers } from "@/utils/handlers";
import { useMediaGlobalProps } from "@/hooks/dataProps";
import type { ButtonAttributes } from "@/types";

interface VideoOverlayRootProps extends Omit<ButtonAttributes, "onDoubleClick"> {
  label: string;
  onDoubleClick?: OverlayInteractivityOptions["onDoubleClick"];
  onDoubleTouch?: OverlayInteractivityOptions["onDoubleTouch"];
  skipInterval?: number;
  doubleClickInterval?: number;
  ref?: Ref<HTMLButtonElement>;
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
  const mediaDataAttrs = useMediaGlobalProps();
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
