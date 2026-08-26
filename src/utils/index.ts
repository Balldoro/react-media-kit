import type { PlayerState, Selector } from "@/state/types";

export const isEqual = (a: unknown, b: unknown) => {
  if (Object.is(a, b)) return true;
  if (typeof a !== "object" || typeof b !== "object" || a === null || b === null) return false;

  const entriesA = Object.entries(a);
  const entriesB = Object.entries(b);
  if (entriesA.length !== entriesB.length) return false;
  return entriesA.every(([k, v]) => Object.is(v, (b as Record<string, unknown>)[k]));
};

export function shallow<T extends {}>(selector: Selector<T>) {
  let prev: T | null = null;
  return (state: PlayerState) => {
    const next = selector(state);
    if (prev && isEqual(prev, next)) return prev;
    prev = next;
    return next;
  };
}

export const toPercent = (value: number) => value * 100;

export const safeDivide = (divident: number, divisor: number) =>
  divisor === 0 ? 0 : divident / divisor;
