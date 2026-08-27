import { describe, expect, it } from "vitest";
import { setDataAttr } from "@/utils/attributes";

describe("setDataAttr", () => {
  it("returns true when the condition is true", () => {
    expect(setDataAttr(true)).toBe(true);
  });

  it("returns undefined when the condition is false", () => {
    expect(setDataAttr(false)).toBeUndefined();
  });
});
