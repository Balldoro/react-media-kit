import type { HTMLAttributes } from "react";

export interface TrackProps extends HTMLAttributes<HTMLDivElement> {}

export function Track({ style, ...props }: TrackProps) {
  return <div style={{ ...style, position: "relative" }} {...props} />;
}
