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

| File | Export | Description |
| --- | --- | --- |
| `use-copy-to-clipboard.ts` | `useCopyToClipboard` | Copies text via the Clipboard API and tracks a short-lived `copiedToClipboard` flag |
| `use-debounce.ts` | `useDebounce` | Returns a debounced copy of a value after a delay (pass `delay <= 0` to skip debouncing) |
| `use-geolocation.ts` | `useGeolocation` | Requests the user's coordinates once via the Geolocation API |
| `use-indexed-db.ts` | `useIndexedDB` | Opens and exposes CRUD helpers for IndexedDB stores defined in `@/config/indexeddb` |
| `use-local-storage.ts` | `useLocalStorage` | Persists and retrieves Zod-validated values in `localStorage` with safe get/save/clear helpers |
| `use-session-storage.ts` | `useSessionStorage` | Persists and retrieves Zod-validated values in `sessionStorage` with safe get/save/clear helpers |

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

## Adding a new hook

1. Create a kebab-case file with a `use-` prefix in `src/hooks/`
2. Export a named `const` hook
3. Update this README index
