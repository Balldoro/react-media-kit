import { describe, expect, it } from "vitest";
import { safeDivide, toPercent } from "@/utils/math";

describe("toPercent", () => {
  it("converts to a percentage", () => {
    expect(toPercent(-10)).toBe(-1000);
    expect(toPercent(0.5)).toBe(50);
    expect(toPercent(0.25)).toBe(25);
    expect(toPercent(1)).toBe(100);
  });
});

describe("safeDivide", () => {
  it("divides two numbers", () => {
    expect(safeDivide(10, 2)).toBe(5);
    expect(safeDivide(1, 4)).toBe(0.25);
  });

  it("returns 0 when the divisor is 0", () => {
    expect(safeDivide(10, 0)).toBe(0);
    expect(safeDivide(0, 0)).toBe(0);
  });
});
