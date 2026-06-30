# TanStack Query

Client-side query cache with optional IndexedDB persistence.

## Setup

Persistence is skipped when `SKIP_CACHE_RESTORE=true` (set automatically in Vitest via `vitest.setup.ts`).

Configure defaults in `@/config/tanstack-query` and the IndexedDB store in `@/config/indexeddb` (`react-query` store).

Wrap the app with `TanstackQueryProvider` from `@/components/providers/tanstack-query` (or compose it via `@/utils/app/compose-providers`).

## Index

| File                   | Export                                           | Description                                                 |
| ---------------------- | ------------------------------------------------ | ----------------------------------------------------------- |
| `index.ts`             | `queryClient`                                    | Shared `QueryClient` with defaults from config              |
| `persister.ts`         | `createQueryClientPersister`                     | Persister factory for `@tanstack/query-persist-client-core` |
| `persister-methods.ts` | `persistClient`, `restoreClient`, `removeClient` | IndexedDB read/write helpers for the offline cache          |

## Related modules

| Location                                | Role                                              |
| --------------------------------------- | ------------------------------------------------- |
| `@/config/tanstack-query`               | `REACT_QUERY_CONFIG`, `REACT_QUERY_CACHE_KEY`     |
| `@/hooks/use-query-client-restore`      | Waits for cache restore before rendering children |
| `@/components/providers/tanstack-query` | `TanstackQueryProvider`                           |

## Usage

### Provider

```tsx
import { TanstackQueryProvider } from '@/components/providers/tanstack-query'

;<TanstackQueryProvider>{children}</TanstackQueryProvider>
```

### Compose with other providers

```tsx
import { TanstackQueryProvider } from '@/components/providers/tanstack-query'
import { composeProviders } from '@/utils/app/compose-providers'

const Providers = composeProviders(TanstackQueryProvider)
```

### Opt out of persisting a query

Set `meta.persist` to `false` on the query options.

## Adding features

1. Extend `@/config/tanstack-query` for shared defaults
2. Keep IndexedDB access in `persister-methods.ts`
3. Update this README and `@/config/README.md`
