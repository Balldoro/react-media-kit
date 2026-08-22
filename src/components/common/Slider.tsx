import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";

export interface SliderProps extends HTMLAttributes<HTMLDivElement> {}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({ style, ...props }: SliderProps, ref) => {
    return (
      <div ref={ref} style={{ ...defaultStyle, ...style }} {...props} role="slider" tabIndex={0} />
    );
  },
);

const defaultStyle: CSSProperties = {
  touchAction: "none",
  position: "relative",
  cursor: "pointer",
  width: "100%",
};
