import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useMergeRefs } from "@/hooks/useMergeRefs";

const createObjectRef = () => ({ current: null });
const createNode = () => document.createElement("div");

describe("useMergeRefs", () => {
  it("updates every ref for a mix of object and callback refs", () => {
    const objectRef = createObjectRef();
    const callbackRef = vi.fn();
    const { result } = renderHook(() => useMergeRefs(objectRef, callbackRef));
    const node = createNode();

    result.current(node);

    expect(objectRef.current).toBe(node);
    expect(callbackRef).toHaveBeenCalledWith(node);
  });

  it("returns a cleanup that resets object refs to null", () => {
    const objectRef = createObjectRef();
    const { result } = renderHook(() => useMergeRefs(objectRef));
    const node = createNode();

    const cleanup = result.current(node);
    expect(objectRef.current).toBe(node);

    cleanup?.();
    expect(objectRef.current).toBeNull();
  });

  it("calls a callback ref's own returned cleanup function", () => {
    const refCleanup = vi.fn();
    const callbackRef = vi.fn(() => refCleanup);
    const { result } = renderHook(() => useMergeRefs(callbackRef));
    const node = createNode();

    const cleanup = result.current(node);
    callbackRef.mockClear();
    cleanup?.();

    expect(refCleanup).toHaveBeenCalledTimes(1);
    expect(callbackRef).not.toHaveBeenCalled();
  });

  it("calls a legacy callback ref with null on cleanup", () => {
    const callbackRef = vi.fn(() => undefined);
    const { result } = renderHook(() => useMergeRefs(callbackRef));
    const node = createNode();

    const cleanup = result.current(node);
    cleanup?.();

    expect(callbackRef).toHaveBeenNthCalledWith(2, null);
  });

  it("returns a new function reference once a ref actually changes", () => {
    const objectRef = createObjectRef();
    const { result, rerender } = renderHook(({ ref }) => useMergeRefs(ref), {
      initialProps: { ref: objectRef },
    });

    const first = result.current;
    rerender({ ref: createObjectRef() });
    const second = result.current;

    expect(second).not.toBe(first);
  });
});
