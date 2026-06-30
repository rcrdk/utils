# Config

Shared app configuration constants. Integration setup (Auth.js, Sentry SDK) lives in `src/lib/`; route paths and store schemas live here.

---

## Index

| File                | Export                                        | Description                                                             |
| ------------------- | --------------------------------------------- | ----------------------------------------------------------------------- |
| `auth.ts`           | `AUTH_CONFIG`                                 | Auth route paths — login, post sign-in redirect, post sign-out redirect |
| `indexeddb.ts`      | `INDEXED_DB_CONFIG`                           | Database name, version, and store definitions used by `useIndexedDB`    |
| `tanstack-query.ts` | `REACT_QUERY_CONFIG`, `REACT_QUERY_CACHE_KEY` | TanStack Query defaults and IndexedDB cache key                         |

## Usage

### Auth routes

```typescript
import { AUTH_CONFIG } from '@/config/auth'

AUTH_CONFIG.LOGIN_PATH // '/login'
AUTH_CONFIG.DEFAULT_REDIRECT_PATH // '/' — after sign-in
AUTH_CONFIG.SIGN_OUT_REDIRECT_PATH // '/login' — after sign-out
```

See [lib/auth/README.md](../lib/auth/README.md) for OAuth setup and Server Actions.

### IndexedDB stores

```typescript
import { INDEXED_DB_CONFIG } from '@/config/indexeddb'

INDEXED_DB_CONFIG.DB_NAME
INDEXED_DB_CONFIG.STORES
```

Configure stores before using `@/hooks/use-indexed-db`.

### TanStack Query

```typescript
import { REACT_QUERY_CACHE_KEY, REACT_QUERY_CONFIG } from '@/config/tanstack-query'

REACT_QUERY_CONFIG.staleTime
REACT_QUERY_CACHE_KEY
```

See [lib/tanstack-query/README.md](../lib/tanstack-query/README.md) for provider and persistence setup.

## Adding config

1. Create a kebab-case file or folder under `src/config/`
2. Export constants with `as const` when the shape should be readonly
3. Update this README index
