# Hooks

Shared React hooks used across routes. Route-local hooks stay colocated under `src/app/`.

## Conventions

- **Location**: `src/hooks/` (one hook per file, or a subfolder when tests are added)
- **File names**: kebab-case with `use-` prefix (`use-debounce.ts`)
- **Exports**: named `const` arrow functions — no default exports
- **Types**: `type` for return shapes and local types; `interface` for simple object props when needed
- **Imports**: use `@/hooks/...`

See [typescript](../../agents/rules/typescript.mdc) for type conventions.

## Index

| File                            | Export                    | Description                                                                                      |
| ------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------ |
| `use-copy-to-clipboard.ts`      | `useCopyToClipboard`      | Copies text via the Clipboard API and tracks a short-lived `copiedToClipboard` flag              |
| `use-debounce.ts`               | `useDebounce`             | Returns a debounced copy of a value after a delay (pass `delay <= 0` to skip debouncing)         |
| `use-geolocation.ts`            | `useGeolocation`          | Requests the user's coordinates once via the Geolocation API                                     |
| `use-indexed-db.ts`             | `useIndexedDB`            | Opens and exposes CRUD helpers for IndexedDB stores defined in `@/config/indexeddb`              |
| `use-intersection-observer.ts`  | `useIntersectionObserver` | Observes when a ref'd element enters or leaves the viewport (or a custom root)                   |
| `use-local-storage.ts`          | `useLocalStorage`         | Persists and retrieves Zod-validated values in `localStorage` with safe get/save/clear helpers   |
| `use-resize-observer.ts`        | `useResizeObserver`       | Observes size changes on a ref'd element and exposes `width` and `height` from `contentRect`     |
| `use-session-storage.ts`        | `useSessionStorage`       | Persists and retrieves Zod-validated values in `sessionStorage` with safe get/save/clear helpers |
| `use-query-client-restore.ts`   | `useQueryClientRestore`   | Gates rendering until the TanStack Query IndexedDB cache is restored (skipped in tests)          |

### `tanstack-query/`

| File         | Export                      | Description                              |
| ------------ | --------------------------- | ---------------------------------------- |
| `use-foo.ts` | `useFoo`, `fetchFoo` | Example `useQuery` hook that fetches foo |

## Usage

### `useDebounce` — delayed value updates

```tsx
import { useDebounce } from '@/hooks/use-debounce'

const [query, setQuery] = useState('')
const debouncedQuery = useDebounce(query, 300)

useEffect(() => {
  // runs after the user stops typing for 300ms
  fetchResults(debouncedQuery)
}, [debouncedQuery])
```

### `useCopyToClipboard` — copy with feedback

```tsx
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

const { onCopyToClipboard, copiedToClipboard } = useCopyToClipboard()

<button type="button" onClick={() => onCopyToClipboard(shareUrl)}>
  {copiedToClipboard ? 'Copied!' : 'Copy link'}
</button>
```

### `useGeolocation` — one-shot location request

```tsx
import { useGeolocation } from '@/hooks/use-geolocation'

const { location, isRequestingLocation, onRequestLocation } = useGeolocation()

<button type="button" onClick={onRequestLocation} disabled={isRequestingLocation}>
  Use my location
</button>

{location && <span>{location.lat}, {location.lng}</span>}
```

### `useIndexedDB` — typed store access

Configure stores in `@/config/indexeddb` first, then use the hook for async CRUD:

```tsx
import { useIndexedDB } from '@/hooks/use-indexed-db'

const { db, isDatabaseReady } = useIndexedDB()

useEffect(() => {
  if (!isDatabaseReady) return

  void db.upsert('chat-messages', { id: 1, text: 'Hello' })
}, [db, isDatabaseReady])
```

Available methods on `db`: `add`, `put`, `upsert`, `getItem`, `getAll`, `deleteItem`, `deleteMany`.

### `useIntersectionObserver` — viewport visibility

Attach a ref to the element you want to observe. Pass `enabled: false` to pause observation.

```tsx
import { useRef } from 'react'

import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

const ref = useRef<HTMLDivElement>(null)
const { isIntersecting, entry } = useIntersectionObserver({
  ref,
  threshold: 0.5,
  rootMargin: '100px',
})

return (
  <div ref={ref}>
    {isIntersecting ? 'Visible' : 'Hidden'}
  </div>
)
```

Returns `{ entry, isIntersecting }`. Supports `root`, `rootMargin`, `threshold`, and `enabled`.

### `useResizeObserver` — element size changes

Attach a ref to the element you want to measure. Pass `enabled: false` to pause observation.

```tsx
import { useRef } from 'react'

import { useResizeObserver } from '@/hooks/use-resize-observer'

const ref = useRef<HTMLDivElement>(null)
const { width, height } = useResizeObserver({ ref, box: 'border-box' })

return (
  <div ref={ref}>
    {width !== null && height !== null && `${width}×${height}`}
  </div>
)
```

Returns `{ entry, width, height }`. Supports `box` and `enabled`.

### `useLocalStorage` — typed local persistence

Pass a Zod schema so reads are validated and invalid or corrupt entries are ignored:

```tsx
import { z } from 'zod'

import { useLocalStorage } from '@/hooks/use-local-storage'

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark']),
  compactMode: z.boolean(),
})

const { getLocalValue, saveLocalValue, clearLocalValue } = useLocalStorage({
  localStorageKey: 'user-preferences',
  schema: preferencesSchema,
})

const storedPreferences = getLocalValue()

if (storedPreferences) {
  // storedPreferences is typed and validated
}

saveLocalValue({ theme: 'dark', compactMode: false })
clearLocalValue()
```

### `useSessionStorage` — typed session persistence

Pass a Zod schema so reads are validated and invalid or corrupt entries are ignored:

```tsx
import { z } from 'zod'

import { useSessionStorage } from '@/hooks/use-session-storage'

const filtersSchema = z.object({
  query: z.string(),
  page: z.number(),
})

const { getSessionValue, saveSessionValue, clearSessionValue } = useSessionStorage({
  sessionStorageKey: 'search-filters',
  schema: filtersSchema,
})

const storedFilters = getSessionValue()

if (storedFilters) {
  // storedFilters is typed and validated
}

saveSessionValue({ query: 'apartments', page: 1 })
clearSessionValue()
```

### `useQueryClientRestore` — wait for offline cache restore

Used by `TanstackQueryProvider`. Returns `true` while the IndexedDB cache is restoring. Set `SKIP_CACHE_RESTORE=true` to skip (Vitest does this automatically).

```tsx
import { useQueryClientRestore } from '@/hooks/use-query-client-restore'

const isWaitingForRestore = useQueryClientRestore()

if (isWaitingForRestore) return null
```

### `useFoo` — example TanStack Query fetch

```tsx
import { useFoo } from '@/hooks/tanstack-query/use-foo'

const { foo, isLoading, isError } = useFoo()

if (isLoading) return <p>Loading…</p>
if (isError) return <p>Failed to load foo</p>

return <p>{foo?.message}</p>
```

Pass any `useQuery` option except `queryKey` and `queryFn`:

```tsx
const { foo } = useFoo({ enabled: isSignedIn, staleTime: 60_000 })
```

Fetches from `/api/foo`. Use `fetchFoo` directly for prefetching or mutations.

## Adding a new hook

1. Create a kebab-case file with a `use-` prefix in `src/hooks/`
2. Export a named `const` hook
3. Update this README index
