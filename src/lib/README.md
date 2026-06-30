# Lib

Third-party wrappers and integrations. Keep vendor-specific setup here; route-level Server Actions stay in `src/app/_actions/`.

## Conventions

- **Location**: `src/lib/<integration>/` (e.g. `auth/`, `sentry/`)
- **File names**: kebab-case
- **Exports**: named exports only — no default exports
- **Server-only modules**: use `import 'server-only'` for helpers that must not run on the client
- **Imports**: use `@/lib/...` (prefer barrel `index.ts` when available)

## Modules

| Folder            | Description                                      | README                                         |
| ----------------- | ------------------------------------------------ | ---------------------------------------------- |
| `auth/`           | Auth.js (next-auth v5) session and OAuth setup   | [auth/README.md](./auth/README.md)             |
| `sentry/`         | Sentry error reporting and SDK configuration     | [sentry/README.md](./sentry/README.md)         |
| `tanstack-query/` | TanStack Query client and IndexedDB persistence  | [tanstack-query/README.md](./tanstack-query/README.md) |

## Adding a new integration

1. Create a kebab-case folder under `src/lib/`
2. Add an `index.ts` barrel with explicit named exports
3. Colocate tests under `__tests__/`
4. Add a README in the folder and link it from this index
