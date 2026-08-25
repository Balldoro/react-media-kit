import { describe, expect, it } from "vitest";
import {
  createTimeLabelFormatter,
  getDurationTimeFormat,
  getTimeFormat,
  getTimeParts,
  normalizeTime,
} from "@/utils/time";

describe("getTimeParts", () => {
  it("correctly formats valid durations", () => {
    expect(getTimeParts(3661)).toEqual({ hours: 1, minutes: 1, seconds: 1 });
    expect(getTimeParts(0)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
    expect(getTimeParts(45)).toEqual({ hours: 0, minutes: 0, seconds: 45 });
    expect(getTimeParts(61.9)).toEqual({ hours: 0, minutes: 1, seconds: 1 });
  });

  it("returns zeros for incorrect durations", () => {
    expect(getTimeParts(-5)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
    expect(getTimeParts(NaN)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
    expect(getTimeParts(Infinity)).toEqual({ hours: 0, minutes: 0, seconds: 0 });
  });
});

describe("getTimeFormat", () => {
  it("properly formats valid durations", () => {
    expect(getTimeFormat(5)).toBe("0:05");
    expect(getTimeFormat(65)).toBe("1:05");
    expect(getTimeFormat(3605)).toBe("1:00:05");
    expect(getTimeFormat(0)).toBe("0:00");
  });

  it("formats negative/non-finite durations as 0:00", () => {
    expect(getTimeFormat(-10)).toBe("0:00");
    expect(getTimeFormat(NaN)).toBe("0:00");
  });
});

describe("getDurationTimeFormat", () => {
  it("correctly formats valid duration to ISO-8601", () => {
    expect(getDurationTimeFormat(3661)).toBe("PT1H1M1S");
    expect(getDurationTimeFormat(0)).toBe("PT0H0M0S");
  });

  it("correctly formats negative/non-finite durations", () => {
    expect(getDurationTimeFormat(-1)).toBe("PT0H0M0S");
    expect(getDurationTimeFormat(Infinity)).toBe("PT0H0M0S");
  });
});

describe("normalizeTime", () => {
  it("returns finite values unchanged", () => {
    expect(normalizeTime(42.5)).toBe(42.5);
  });

  it("returns 0 for incorrect input", () => {
    expect(normalizeTime(NaN)).toBe(0);
    expect(normalizeTime(Infinity)).toBe(0);
  });
});

describe("createTimeLabelFormatter", () => {
  it("properly formats duration", () => {
    const format = createTimeLabelFormatter("en-US");
    expect(format(3661)).toBe("1 hour, 1 minute, and 1 second");
    expect(format(9)).toBe("9 seconds");
    expect(format(-5)).toBe("0 seconds");
    expect(format(NaN)).toBe("0 seconds");
  });
});
