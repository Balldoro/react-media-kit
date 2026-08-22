import type { HTMLAttributes } from "react";
import { useTimeDisplay } from "../TimeDisplayContext";
import { composeHandlers } from "@/utils/handlers";

interface TimeDisplayToggleProps extends HTMLAttributes<HTMLButtonElement> {}

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
