import { describe, expect, it } from "vitest";
import { setDataAttr } from "@/utils/dom";

describe("setDataAttr", () => {
  it("returns true when the condition is true", () => {
    expect(setDataAttr(true)).toBe(true);
  });

  it("returns undefined when the condition is false", () => {
    expect(setDataAttr(false)).toBeUndefined();
  });
});
