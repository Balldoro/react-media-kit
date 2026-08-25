import { describe, expect, it, vi } from "vitest";
import { composeHandlers } from "@/utils/handlers";

describe("composeHandlers", () => {
  it("calls every handler, in order, with the event", () => {
    const calls: string[] = [];
    const a = vi.fn(() => calls.push("a"));
    const b = vi.fn(() => calls.push("b"));
    const event = { defaultPrevented: false };

    composeHandlers(a, b)(event);

    expect(calls).toEqual(["a", "b"]);
    expect(a).toHaveBeenCalledWith(event);
    expect(b).toHaveBeenCalledWith(event);
  });

  it("skips undefined handlers without throwing", () => {
    const a = vi.fn();
    const event = { defaultPrevented: false };

    expect(() => composeHandlers(undefined, a, undefined)(event)).not.toThrow();
    expect(a).toHaveBeenCalledTimes(1);
  });

  it("stops calling further handlers once one marks the event defaultPrevented", () => {
    const event = { defaultPrevented: false };
    const a = vi.fn(() => {
      event.defaultPrevented = true;
    });
    const b = vi.fn();

    composeHandlers(a, b)(event);

    expect(a).toHaveBeenCalledTimes(1);
    expect(b).not.toHaveBeenCalled();
  });

  it("calls no handlers at all if the event already arrives defaultPrevented", () => {
    const event = { defaultPrevented: true };
    const a = vi.fn();

    composeHandlers(a)(event);

    expect(a).not.toHaveBeenCalled();
  });
});
