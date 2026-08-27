import { describe, expect, it } from "vitest";
import { getBufferedEnd } from "@/utils/buffer";

const fakeTimeRanges = (ranges: [number, number][]): TimeRanges => ({
  length: ranges.length,
  start: (index: number) => ranges[index]![0],
  end: (index: number) => ranges[index]![1],
});

describe("getBufferedEnd", () => {
  it("returns the given time when there is nothing buffered", () => {
    expect(getBufferedEnd(undefined, 12)).toBe(12);
  });

  it("returns the end of the range containing the given time", () => {
    expect(getBufferedEnd(fakeTimeRanges([[0, 20]]), 5)).toBe(20);
  });

  it("picks the range that contains the time out of several disjoint ranges", () => {
    const buffered = fakeTimeRanges([
      [0, 12],
      [40, 55],
    ]);
    expect(getBufferedEnd(buffered, 45)).toBe(55);
  });

  it("falls back to the given time when it falls in a gap between ranges", () => {
    const buffered = fakeTimeRanges([
      [0, 12],
      [40, 55],
    ]);
    expect(getBufferedEnd(buffered, 20)).toBe(20);
  });
});
