# Components

Shared React components used across routes. Route-local UI stays in `src/app/_components/`.

## Conventions

- **Location**: `src/components/` (one component per file, or a subfolder when tests are added)
- **File names**: kebab-case (`polymorphic-component.tsx`)
- **Exports**: named exports only — no default exports
- **Props**: `interface` for simple shapes; wrap with `Readonly` in the function signature
- **Imports**: use `@/components/...`

See [react-components](../../agents/rules/react-components.mdc) for full rules (styling, accessibility, JSX conditionals).

## Index

| File                              | Export                 | Description                                  |
| --------------------------------- | ---------------------- | -------------------------------------------- |
| `examples/polymorphic-component.tsx` | `PolymorphicComponent` | Polymorphic component with an `as` prop      |
| `examples/audio-recorder/`        | `AudioRecorder`        | Microphone recorder with transcription wiring |
| `providers/tanstack-query.tsx`    | `TanstackQueryProvider`| TanStack Query client with IndexedDB restore |

## Usage

### `PolymorphicComponent` — polymorphic `as` prop

Renders as a `<p>` by default, or as any element/component passed via `as`. Inherits that element's props.

```tsx
import { PolymorphicComponent } from '@/components/examples/polymorphic-component'

<PolymorphicComponent>Default paragraph</PolymorphicComponent>

<PolymorphicComponent as="span" className="font-medium">
  Inline label
</PolymorphicComponent>

<PolymorphicComponent as="h1" id="title">
  Page heading
</PolymorphicComponent>
```

### `TanstackQueryProvider` — query client with offline restore

```tsx
import { TanstackQueryProvider } from '@/components/providers/tanstack-query'

<TanstackQueryProvider>{children}</TanstackQueryProvider>
```

Returns `null` until the IndexedDB cache restore completes (unless `SKIP_CACHE_RESTORE=true`).

### `AudioRecorder` — record and transcribe audio

See [`examples/audio-recorder/README.md`](examples/audio-recorder/README.md) for full API, behavior, and tests.

```tsx
import { transcribeAudioAction } from '@/app/_actions/transcribe'
import { AudioRecorder } from '@/components/examples/audio-recorder'

<AudioRecorder
  transcribeAction={transcribeAudioAction}
  onTranscription={(text) => setMessage(text)}
  onError={(error) => toast.error(error)}
/>
```

## Adding a new component

1. Create a kebab-case file in `src/components/`
2. Export a named function component with `Readonly` props
3. Update this README index
