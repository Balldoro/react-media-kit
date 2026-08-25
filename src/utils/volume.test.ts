import { describe, expect, it } from "vitest";
import { clampVolume } from "@/utils/volume";

describe("clampVolume", () => {
  it("clamps values above 1", () => {
    expect(clampVolume(1.5)).toBe(1);
  });

  it("clamps values below 0", () => {
    expect(clampVolume(-0.5)).toBe(0);
  });

  it("leaves in-range values untouched", () => {
    expect(clampVolume(0.42)).toBe(0.42);
  });
});
