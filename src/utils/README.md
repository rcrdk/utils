# Utils

Copy-paste utility snippets organized by domain. Each file exports one or more `const` arrow functions.

## Conventions

- **Location**: `src/utils/<domain>/` (e.g. `array/`, `string/`, `ui/`)
- **File names**: kebab-case (`group-by.ts`, `generate-slug.ts`)
- **Exports**: named `const` arrow functions — no default exports
- **Imports**: use `@/utils/...` (see [tsconfig paths](../../tsconfig.json))

## Index

### `array/`

| File                   | Export            | Description                                                  |
| ---------------------- | ----------------- | ------------------------------------------------------------ |
| `group-by.ts`          | `groupBy`         | Groups a collection by a key into a record of arrays         |
| `is-query-included.ts` | `isQueryIncluded` | Accent-insensitive substring match for search/filter queries |

### `string/`

| File               | Export         | Description                              |
| ------------------ | -------------- | ---------------------------------------- |
| `generate-slug.ts` | `generateSlug` | Normalizes a string into a URL-safe slug |

### `ui/`

| File    | Export | Description                                                |
| ------- | ------ | ---------------------------------------------------------- |
| `tw.ts` | `cn`   | Merges Tailwind class names with `clsx` + `tailwind-merge` |

### `action/`

| File                   | Export                                      | Description                                                                                               |
| ---------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `validated-actions.ts` | `validatedActionWithUser`, `actionWithUser` | Server action wrappers with Auth.js session checks, optional Zod validation, and unauthorized redirect      |

Requires auth setup in `@/lib/auth` for `validated-actions`. Unauthenticated calls redirect to `AUTH_CONFIG.LOGIN_PATH` unless `disableRedirectOnError` is set.

### `app/`

| File                   | Export             | Description                                      |
| ---------------------- | ------------------ | ------------------------------------------------ |
| `compose-providers.ts` | `composeProviders` | Nests multiple React context providers into one  |

## Usage

```typescript
import { actionWithUser, validatedActionWithUser } from '@/utils/action/validated-actions'
import { composeProviders } from '@/utils/app/compose-providers'
import { groupBy } from '@/utils/array/group-by'
import { isQueryIncluded } from '@/utils/array/is-query-included'
import { generateSlug } from '@/utils/string/generate-slug'
import { cn } from '@/utils/ui/tw'

const byStatus = groupBy(tasks, 'status')

const matches = isQueryIncluded('sao', 'São Paulo')

const slug = generateSlug('Hello World') // 'hello-world'

const className = cn('px-4', isActive && 'bg-blue-500', className)

const Providers = composeProviders(ThemeProvider, QueryProvider)
```

### `validatedActionWithUser` / `actionWithUser` — authenticated server actions

Uses `getSessionUser` from `@/lib/auth`. The `user` argument is typed as `User` from `@/types/auth/user`.

```typescript
import { z } from 'zod'

import { actionWithUser, validatedActionWithUser } from '@/utils/action/validated-actions'

const taskSchema = z.object({ title: z.string() })

const saveTask = validatedActionWithUser(taskSchema, async (data, user) => {
  // data is validated, user is authenticated
  return { title: data.title, userId: user.id }
})

const loadProfile = actionWithUser(async (user) => user.email)

// return null instead of redirecting when unauthenticated
const loadProfileSilently = actionWithUser(async (user) => user.email, {
  disableRedirectOnError: true,
})
```

## Adding a new util

1. Pick or create a domain folder under `src/utils/`
2. Add a kebab-case file with a named `const` export
3. Update this README index
