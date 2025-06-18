export function throttleCall<T = unknown, R = unknown>(
  fn: (...args: T[]) => Promise<R>,
  delay = 1000
): (...args: T[]) => Promise<R> {
  let lastCall: number = 0;
  let lastResult: Promise<R>;

  return async function (...args: T[]) {
    const now = Date.now();

    if (now - lastCall >= delay) {
      lastCall = now;
      lastResult = fn(...args);
    }

    return await lastResult;
  };
}
