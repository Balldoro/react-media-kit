import type { Ref } from "react";
import { useTimeDisplay } from "../TimeDisplayContext";
import { composeHandlers } from "@/utils/handlers";
import type { ButtonAttributes } from "@/types";
import { useMediaAttributes } from "@/hooks/useMediaAttributes";
import { DATA_ATTRS } from "@/constants";

interface TimeDisplayToggleProps extends ButtonAttributes {
  ref?: Ref<HTMLButtonElement>;
}

export function TimeDisplayToggle({ onClick, ...props }: TimeDisplayToggleProps) {
  const { toggleMode, isElapsedMode } = useTimeDisplay();
  const mediaDataAttrs = useMediaAttributes();

  return (
    <button
      aria-label={`See ${isElapsedMode ? "remaining" : "elapsed"} time`}
      {...props}
      type="button"
      onClick={composeHandlers(onClick, toggleMode)}
      {...{ [DATA_ATTRS.elapsedMode]: isElapsedMode }}
      {...mediaDataAttrs}
    />
  );
}
