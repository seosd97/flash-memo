export function flashMemo<T = unknown, R = unknown>(
  fn: (...args: T[]) => Promise<R>,
  delay = 1000
): (...args: T[]) => Promise<R> {
  let lastCall: number = 0;
  let lastResult: Promise<R>;

  if (delay <= 0) {
    return fn;
  }

  return async function (...args: T[]) {
    const now = Date.now();

    if (now - lastCall < delay) {
      return lastResult;
    }

    lastCall = now;
    lastResult = fn(...args);
    return lastResult;
  };
}
