import type { CSSProperties, HTMLAttributes } from "react";

export interface TrackProps extends HTMLAttributes<HTMLDivElement> {}

export function Track({ style, ...props }: TrackProps) {
  return <div style={{ ...defaultStyle, ...style }} {...props} />;
}

const defaultStyle: CSSProperties = { position: "relative", width: "100%" };
