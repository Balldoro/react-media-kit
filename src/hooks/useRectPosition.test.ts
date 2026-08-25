import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useRectPosition } from "@/hooks/useRectPosition";

function createRect(): DOMRect {
  return {
    left: 100,
    top: 0,
    width: 200,
    height: 0,
    right: 0,
    bottom: 0,
    x: 0,
    y: 0,
    toJSON: () => "",
  };
}

describe("useRectPosition", () => {
  it("computes the fraction across the rect width", () => {
    const { result } = renderHook(() => useRectPosition());
    result.current.setRect(createRect());

    expect(result.current.calcRectPositionX(150)).toBe(0.25);
  });

  it("returns 0 at the left edge and 1 at the right edge", () => {
    const { result } = renderHook(() => useRectPosition());
    result.current.setRect(createRect());

    expect(result.current.calcRectPositionX(100)).toBe(0);
    expect(result.current.calcRectPositionX(300)).toBe(1);
  });

  it("does not clamp positions outside the rect", () => {
    const { result } = renderHook(() => useRectPosition());
    result.current.setRect(createRect());

    expect(result.current.calcRectPositionX(0)).toBe(-0.5);
    expect(result.current.calcRectPositionX(400)).toBe(1.5);
  });
});
