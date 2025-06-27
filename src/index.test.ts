import { describe, it, expect, vi, beforeEach } from "vitest";
import { flashMemo } from "./index";

describe("flashMemo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should call the function immediately on first call", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const memoized = flashMemo(mockFn, { cacheTime: 1000 });

    const result = await memoized("arg1");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("arg1");
    expect(result).toBe("result");
  });

  it("should return cached result when called within cacheTime period", async () => {
    const mockFn = vi
      .fn()
      .mockResolvedValueOnce("first")
      .mockResolvedValueOnce("second");
    const memoized = flashMemo(mockFn, { cacheTime: 1000 });

    const result1 = await memoized("arg1");
    const result2 = await memoized("arg2");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(result1).toEqual(result2);
  });

  it("should call function again after cacheTime period", async () => {
    const mockFn = vi
      .fn()
      .mockResolvedValueOnce("first")
      .mockResolvedValueOnce("second");
    const memoized = flashMemo(mockFn, { cacheTime: 1000 });

    await memoized("arg1");
    vi.advanceTimersByTime(1000);
    const result = await memoized("arg2");

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(result).toBe("second");
  });

  it("should use default cacheTime of 1000ms", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const memoized = flashMemo(mockFn);

    await memoized();
    await memoized();

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should handle function rejections", async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error("test error"));
    const memoized = flashMemo(mockFn, { cacheTime: 1000 });

    await expect(memoized()).rejects.toThrow("test error");
  });

  it("should return same promise for concurrent calls within cacheTime", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const memoized = flashMemo(mockFn, { cacheTime: 1000 });

    const [result1, result2] = await Promise.all([
      memoized("arg1"),
      memoized("arg2"),
    ]);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(result1).toEqual(result2);
  });

  it("should handle synchronous functions", () => {
    const mockFn = vi.fn().mockReturnValue("result");
    const memoized = flashMemo(mockFn, { cacheTime: 1000 });

    const result1 = memoized("arg1");
    const result2 = memoized("arg2");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(result1).toEqual(result2);
  });
});
