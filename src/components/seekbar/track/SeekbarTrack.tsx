import type { HTMLAttributes } from "react";

export interface SeekbarTrackProps extends HTMLAttributes<HTMLDivElement> {}

export function SeekbarTrack({ style, ...props }: SeekbarTrackProps) {
  return <div style={{ position: "relative", width: "100%", ...style }} {...props} />;
}
