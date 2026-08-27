import type { CSSProperties, HTMLAttributes, Ref } from "react";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  progressVar?: string;
  ref?: Ref<HTMLDivElement>;
}

export function Progress({ progressVar = "", style, ...props }: ProgressProps) {
  return (
    <div
      style={{ ...style, ...defaultStyle, width: `calc(var(${progressVar}, 0) * 1%)` }}
      {...props}
    />
  );
}

const defaultStyle: CSSProperties = {
  height: "100%",
  position: "absolute",
};
