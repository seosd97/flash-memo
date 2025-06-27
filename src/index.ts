import { FlashMemoOptions } from "../types";

export function flashMemo<T = unknown, R = unknown>(
  fn: (...args: T[]) => Promise<R>,
  options?: FlashMemoOptions
): (...args: T[]) => Promise<R>;

export function flashMemo<T = unknown, R = unknown>(
  fn: (...args: T[]) => R,
  options?: FlashMemoOptions
): (...args: T[]) => R;

export function flashMemo<T = unknown, R = unknown>(
  fn: (...args: T[]) => Promise<R>,
  options?: FlashMemoOptions
): (...args: T[]) => Promise<R> {
  let lastCall: number = 0;
  let lastResult: Promise<R>;

  const { cacheTime = 1000 } = options || {};

  if (cacheTime <= 0) {
    return fn;
  }

  return async function (...args: T[]) {
    const now = Date.now();

    if (now - lastCall < cacheTime) {
      return lastResult;
    }

    lastCall = now;
    lastResult = fn(...args);
    return lastResult;
  };
}
