export interface FlashMemoOptions {
  cacheKey?: ((...args: any[]) => string) | string;
  cacheTime?: number;
}
