import type { HTMLAttributes } from "react";

export interface SeekbarTrackProps extends HTMLAttributes<HTMLDivElement> {}

export function SeekbarTrack(props: SeekbarTrackProps) {
  return <div aria-hidden="true" {...props} />;
}
