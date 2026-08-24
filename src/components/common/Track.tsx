import type { HTMLAttributes, Ref } from "react";

export interface TrackProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function Track({ style, ...props }: TrackProps) {
  return <div style={{ ...style, position: "relative" }} {...props} />;
}
