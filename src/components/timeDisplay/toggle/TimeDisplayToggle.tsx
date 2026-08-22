import { useTimeDisplay } from "../TimeDisplayContext";
import { composeHandlers } from "@/utils/handlers";
import type { ButtonAttributes } from "@/types";

interface TimeDisplayToggleProps extends ButtonAttributes {}

export function TimeDisplayToggle({ onClick, ...props }: TimeDisplayToggleProps) {
  const { toggleMode, isElapsedMode } = useTimeDisplay();

  return (
    <button
      {...props}
      type="button"
      aria-pressed={isElapsedMode}
      onClick={composeHandlers(onClick, toggleMode)}
    />
  );
}
