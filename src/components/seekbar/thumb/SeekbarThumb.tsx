import type { HTMLAttributes } from "react";

export interface SeekbarThumbProps extends HTMLAttributes<HTMLDivElement> {}

export function SeekbarThumb(props: SeekbarThumbProps) {
  return <div aria-hidden="true" {...props} />;
}
