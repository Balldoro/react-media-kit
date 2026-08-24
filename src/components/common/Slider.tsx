import type { CSSProperties, HTMLAttributes, Ref } from "react";

export interface SliderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

export function Slider({ style, ...props }: SliderProps) {
  return <div style={{ ...style, ...defaultStyle }} {...props} role="slider" tabIndex={0} />;
}

const defaultStyle: CSSProperties = {
  touchAction: "none",
  position: "relative",
};
