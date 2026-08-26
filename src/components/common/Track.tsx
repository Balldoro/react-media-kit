import type { CSSProperties, HTMLAttributes, Ref } from "react";

export interface TrackProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function Track({ style, ...props }: TrackProps) {
  return <div style={{ ...style, ...defaultStyle }} {...props} />;
}

const defaultStyle: CSSProperties = {
  position: "relative",
  isolation: "isolate",
};
