# Sentry

Wrapper around `@sentry/nextjs` for consistent error reporting and SDK configuration.

Instrumentation entry points (`instrumentation.ts`, `instrumentation-client.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`) consume the config helpers from this module.

## Setup

Add to `.env` (see [.env.example](../../../.env.example)):

```bash
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_SENTRY_ENVIRONMENT="development"
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
```

Sentry capture is disabled when `NEXT_PUBLIC_SENTRY_DSN` is unset.

## Index

| File                 | Export                                              | Description                                      |
| -------------------- | --------------------------------------------------- | ------------------------------------------------ |
| `config.ts`          | `isSentryEnabled`                                   | Whether a DSN is configured                      |
| `config.ts`          | `getClientSentryOptions`                            | Browser SDK options                              |
| `config.ts`          | `getServerSentryOptions`                            | Node SDK options (includes context lines)        |
| `config.ts`          | `getEdgeSentryOptions`                              | Edge SDK options                                 |
| `normalize-error.ts` | `normalizeError`                                    | Coerces unknown values into an `Error` instance  |
| `report-error.ts`    | `reportError`                                       | Logs in dev; captures in Sentry when enabled     |

## Usage

### Report an error

```typescript
import { reportError } from '@/lib/sentry'

reportError({
  error,
  message: 'Failed to save preferences',
  context: {
    tags: { operation: 'save' },
    extra: { userId: user.id },
  },
})
```

Outside production, `reportError` also writes to `console.error`. When the DSN is set, it normalizes the error and calls `Sentry.captureException`.

### Normalize before custom handling

```typescript
import { normalizeError } from '@/lib/sentry'

const error = normalizeError(unknownValue)
```

Handles `Error` instances, strings, objects with a `message`, and unknown values (fallback: `"Unknown error"`).

## Sample rates

| Environment              | `tracesSampleRate` |
| ------------------------ | ------------------ |
| Production               | `0.1`              |
| Development / test       | `1`                |

Environment label comes from `NEXT_PUBLIC_SENTRY_ENVIRONMENT`, falling back to `NODE_ENV`.

## Adding Sentry features

1. Extend `config.ts` for shared SDK options
2. Add helpers beside `report-error.ts` when wrapping new Sentry APIs
3. Export from `index.ts` and update this README index
