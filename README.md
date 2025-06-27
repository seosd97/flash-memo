# Flash Memo

A lightweight TypeScript library for time-based function memoization.

## Installation

```bash
npm install flash-memo
```

## Usage

```typescript
import { flashMemo } from "flash-memo";

// Cache function results for 1 second (default)
const memoized = flashMemo(expensiveFunction);

// Custom cache time
const memoized = flashMemo(expensiveFunction, { cacheTime: 5000 });

// Works with async functions
const asyncMemoized = flashMemo(async (id: string) => {
  return await fetchUser(id);
});
```

## API

### `flashMemo(fn, options?)`

- `fn`: Function to memoize
- `options.cacheTime`: Cache duration in milliseconds (default: 1000)

## Roadmap

- [ ] Argument-based cache comparison
- [ ] Custom cache key generation
