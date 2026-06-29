# Auth

Auth.js (next-auth v5) integration with Google OAuth and JWT sessions.

Sign-in and sign-out **Server Actions** live in `@/app/_actions/auth`. Shared route constants live in `@/config/auth`. The `User` type lives in `@/types/auth/user`.

## Setup

Add to `.env` (see [.env.example](../../../.env.example)):

```bash
AUTH_SECRET=          # openssl rand -base64 32
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

In Google Cloud Console, set the authorized redirect URI to:

`http://localhost:3000/api/auth/callback/google`

## Route config

Update paths in `@/config/auth`:

| Constant                 | Default   | Used for                                |
| ------------------------ | --------- | --------------------------------------- |
| `LOGIN_PATH`             | `/login`  | Auth.js sign-in page, unauthorized redirect |
| `DEFAULT_REDIRECT_PATH`  | `/`       | Post sign-in redirect                   |
| `SIGN_OUT_REDIRECT_PATH` | `/login`  | Post sign-out redirect                  |

## Index

| File                 | Export                          | Description                                           |
| -------------------- | ------------------------------- | ----------------------------------------------------- |
| `config.ts`          | `handlers`, `auth`, `signIn`, `signOut` | NextAuth setup (Google provider, JWT callbacks) |
| `get-session-user.ts`| `getSessionUser`                | Maps the current session to a typed `User` or `null`  |

## Server Actions

| File                      | Export                   | Description                    |
| ------------------------- | ------------------------ | ------------------------------ |
| `app/_actions/auth.ts`    | `signInWithGoogleAction` | Starts Google OAuth flow       |
| `app/_actions/auth.ts`    | `signOutAction`          | Ends the session and redirects |

## Usage

### Sign in / sign out (UI)

```tsx
import { signInWithGoogleAction, signOutAction } from '@/app/_actions/auth'

<form action={signInWithGoogleAction}>
  <button type="submit">Sign in with Google</button>
</form>

<form action={signOutAction}>
  <button type="submit">Sign out</button>
</form>
```

### Session in Server Components

```tsx
import { auth, getSessionUser } from '@/lib/auth'

const session = await auth()

const user = await getSessionUser()
if (!user) return null

return <p>{user.email}</p>
```

### Protected server actions

Use `@/utils/action/validated-actions` — it calls `getSessionUser` and redirects unauthenticated users to `AUTH_CONFIG.LOGIN_PATH`.

```typescript
import { actionWithUser } from '@/utils/action/validated-actions'

const loadProfile = actionWithUser(async (user) => user.email)
```

## API route

OAuth callbacks are handled by `src/app/api/auth/[...nextauth]/route.ts`, which re-exports `handlers` from `@/lib/auth/config`.

## Adding auth features

1. Extend `config.ts` (providers, callbacks, pages)
2. Keep route paths in `@/config/auth`
3. Add Server Actions under `src/app/_actions/`
4. Update this README index
