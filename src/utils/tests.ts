export function stubReadonly<T extends object, K extends keyof T>(target: T, key: K, value: T[K]) {
  Object.defineProperty(target, key, { value, configurable: true });
}
