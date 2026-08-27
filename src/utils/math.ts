export const toPercent = (value: number) => value * 100;

export const safeDivide = (divident: number, divisor: number) =>
  divisor === 0 ? 0 : divident / divisor;
