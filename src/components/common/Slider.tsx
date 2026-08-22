import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";

export interface SliderProps extends HTMLAttributes<HTMLDivElement> {}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  ({ style, ...props }: SliderProps, ref) => {
    return (
      <div ref={ref} style={{ ...style, ...defaultStyle }} {...props} role="slider" tabIndex={0} />
    );
  },
);

const defaultStyle: CSSProperties = {
  touchAction: "none",
  position: "relative",
};
