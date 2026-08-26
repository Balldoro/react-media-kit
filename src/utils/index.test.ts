import { describe, expect, it } from "vitest";
import { isEqual, setDataAttr, shallow, toPercent } from "@/utils";
import { initialState } from "@/state/store";
import type { PlayerState } from "@/state/types";

function createState(overrides: Partial<PlayerState> = {}): PlayerState {
  return { ...initialState, ...overrides };
}

describe("isEqual", () => {
  it("returns true for the same primitive value", () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual("a", "a")).toBe(true);
  });

  it("returns false for different primitive values", () => {
    expect(isEqual(1, 2)).toBe(false);
  });

  it("returns true for the same object reference", () => {
    const obj = { a: 1 };
    expect(isEqual(obj, obj)).toBe(true);
  });

  it("returns false when only one side is an object", () => {
    expect(isEqual({ a: 1 }, 1)).toBe(false);
    expect(isEqual(1, { a: 1 })).toBe(false);
  });

  it("treats null as not equal to an object", () => {
    expect(isEqual(null, {})).toBe(false);
    expect(isEqual({}, null)).toBe(false);
  });

  it("returns true for null compared to null", () => {
    expect(isEqual(null, null)).toBe(true);
  });

  it("returns true for shallow-equal plain objects with a different reference", () => {
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });

  it("returns false when a key's value differs", () => {
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it("returns false when the key count differs", () => {
    expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it("is shallow only: equal-shaped nested objects with different references are not equal", () => {
    expect(isEqual({ a: { x: 1 } }, { a: { x: 1 } })).toBe(false);
  });
});

const selectVolume = (s: PlayerState) => ({ volume: s.volume });

describe("shallow", () => {
  it("returns the selector result on the first call", () => {
    const select = shallow(selectVolume);
    const result = select(createState({ volume: 0.5 }));
    expect(result).toEqual({ volume: 0.5 });
  });

  it("returns the same reference across calls when the selected slice is shallow-equal", () => {
    const select = shallow((s: PlayerState) => ({ volume: s.volume, isMuted: s.isMuted }));

    const first = select(createState({ volume: 0.5, isMuted: false }));
    const second = select(createState({ volume: 0.5, isMuted: false }));

    expect(second).toBe(first);
  });

  it("returns a new reference once the selected slice actually changes", () => {
    const select = shallow(selectVolume);

    const first = select(createState({ volume: 0.5 }));
    const second = select(createState({ volume: 0.9 }));
    const third = select(createState({ volume: 0.9 }));

    expect(second).not.toBe(first);
    expect(third).toBe(second);
  });

  it("keeps independent memoized state per shallow() instance", () => {
    const selectA = shallow(selectVolume);
    const selectB = shallow(selectVolume);

    const a1 = selectA(createState({ volume: 0.5 }));
    selectB(createState({ volume: 0.9 }));
    const a2 = selectA(createState({ volume: 0.5 }));

    expect(a2).toBe(a1);
  });
});

describe("toPercent", () => {
  it("converts to a percentage", () => {
    expect(toPercent(-10)).toBe(-1000);
    expect(toPercent(0.5)).toBe(50);
    expect(toPercent(0.25)).toBe(25);
    expect(toPercent(1)).toBe(100);
  });
});

describe("setDataAttr", () => {
  it("returns true when the condition is true", () => {
    expect(setDataAttr(true)).toBe(true);
  });

  it("returns undefined when the condition is false", () => {
    expect(setDataAttr(false)).toBeUndefined();
  });
});
