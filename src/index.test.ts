import { describe, it, expect, vi, beforeEach } from "vitest";
import { throttleCall } from "./index";

describe("throttleCall", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should call the function immediately on first call", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const throttled = throttleCall(mockFn, 1000);

    const result = await throttled("arg1");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith("arg1");
    expect(result).toBe("result");
  });

  it("should return cached result when called within delay period", async () => {
    const mockFn = vi
      .fn()
      .mockResolvedValueOnce("first")
      .mockResolvedValueOnce("second");
    const throttled = throttleCall(mockFn, 1000);

    const result1 = await throttled("arg1");
    const result2 = await throttled("arg2");

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(result1).toEqual(result2);
  });

  it("should call function again after delay period", async () => {
    const mockFn = vi
      .fn()
      .mockResolvedValueOnce("first")
      .mockResolvedValueOnce("second");
    const throttled = throttleCall(mockFn, 1000);

    await throttled("arg1");
    vi.advanceTimersByTime(1000);
    const result = await throttled("arg2");

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(result).toBe("second");
  });

  it("should use default delay of 1000ms", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const throttled = throttleCall(mockFn);

    await throttled();
    await throttled();

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should handle function rejections", async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error("test error"));
    const throttled = throttleCall(mockFn, 1000);

    await expect(throttled()).rejects.toThrow("test error");
  });

  it("should return same promise for concurrent calls within delay", async () => {
    const mockFn = vi.fn().mockResolvedValue("result");
    const throttled = throttleCall(mockFn, 1000);

    const [result1, result2] = await Promise.all([
      throttled("arg1"),
      throttled("arg2"),
    ]);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(result1).toEqual(result2);
  });
});
