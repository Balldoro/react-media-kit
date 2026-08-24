import { useRef } from "react";

export function useRectPosition() {
  const rectRef = useRef<DOMRect>(null);

  const calcRectPositionX = (clickX: number) => {
    if (!rectRef.current) return null;

    const { left, width } = rectRef.current;
    const containerPos = (clickX - left) / width;

    return containerPos;
  };

  const setRect = (value: DOMRect) => {
    rectRef.current = value;
  };

  return { setRect, calcRectPositionX };
}
