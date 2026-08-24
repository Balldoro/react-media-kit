import type { Ref } from "react";
import { useTimeDisplay } from "../TimeDisplayContext";
import { composeHandlers } from "@/utils/handlers";
import type { ButtonAttributes } from "@/types";

interface TimeDisplayToggleProps extends ButtonAttributes {
  ref?: Ref<HTMLButtonElement>;
}

export function TimeDisplayToggle({ onClick, ...props }: TimeDisplayToggleProps) {
  const { toggleMode, isElapsedMode } = useTimeDisplay();

  return (
    <button
      aria-label={`See ${isElapsedMode ? "remaining" : "elapsed"} time`}
      {...props}
      type="button"
      onClick={composeHandlers(onClick, toggleMode)}
    />
  );
}
