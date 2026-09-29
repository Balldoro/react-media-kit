import { describe, expect, it } from "vitest";
import { normalizeSkipInterval, normalizeVolumeInterval } from "@/utils/validation";
import { ReactMediaKitError } from "@/utils/errors";

describe("normalizeSkipInterval", () => {
  it("floors to a whole second", () => {
    expect(normalizeSkipInterval(1, "Test")).toBe(1);
    expect(normalizeSkipInterval(2.65, "Test")).toBe(2);
    expect(normalizeSkipInterval(10, "Test")).toBe(10);
  });

  it.each([0, 0.99, -10, NaN, Infinity, -Infinity])(
    "throws a ReactMediaKitError for %s",
    (skipInterval) => {
      expect(() => normalizeSkipInterval(skipInterval, "Test")).toThrow(ReactMediaKitError);
    },
  );

  it("names the component in the error message", () => {
    expect(() => normalizeSkipInterval(0, "Seekbar.Root")).toThrow(/^<Seekbar\.Root>/);
  });
});

describe("normalizeVolumeInterval", () => {
  it("returns the value unchanged", () => {
    expect(normalizeVolumeInterval(0.05, "Test")).toBe(0.05);
    expect(normalizeVolumeInterval(0.125, "Test")).toBe(0.125);
    expect(normalizeVolumeInterval(1, "Test")).toBe(1);
  });

  it.each([0, -0.05, 1.01, NaN, Infinity, -Infinity])(
    "throws a ReactMediaKitError for %s",
    (volumeInterval) => {
      expect(() => normalizeVolumeInterval(volumeInterval, "Test")).toThrow(ReactMediaKitError);
    },
  );

  it("names the component in the error message", () => {
    expect(() => normalizeVolumeInterval(0, "Volume.Slider")).toThrow(/^<Volume\.Slider>/);
  });
});
