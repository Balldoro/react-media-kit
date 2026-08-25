import { describe, expect, it } from "vitest";
import { createSeekQueue } from "@/state/seekQueue";

describe("createSeekQueue", () => {
  it("starts with no pending value", () => {
    const queue = createSeekQueue();
    expect(queue.get()).toEqual({ isPending: false });
  });

  it("set makes get reflect the pending value", () => {
    const queue = createSeekQueue();
    queue.set(42);
    expect(queue.get()).toEqual({ isPending: true, value: 42 });
  });

  it("set overwrites a previously pending value", () => {
    const queue = createSeekQueue();
    queue.set(1);
    queue.set(2);
    expect(queue.pop()).toEqual({ isPending: true, value: 2 });
    expect(queue.get()).toEqual({ isPending: false });
  });

  it("pop on an empty queue returns not-pending and stays empty", () => {
    const queue = createSeekQueue();
    expect(queue.pop()).toEqual({ isPending: false });
    expect(queue.get()).toEqual({ isPending: false });
  });

  it("keeps separate state per instance", () => {
    const queueA = createSeekQueue();
    const queueB = createSeekQueue();
    queueA.set(7);
    expect(queueA.get()).toEqual({ isPending: true, value: 7 });
    expect(queueB.get()).toEqual({ isPending: false });
  });
});
