# Audio recorder

Example component for recording microphone audio and transcribing it via a server action.

Composed from `useAudioRecorder`, `useAudioTranscription`, and `useEscapeKey`. Error copy and aria labels live in `@/constants/ui/audio-recorder`.

## Files

| File                 | Export                     | Description                                              |
| -------------------- | -------------------------- | -------------------------------------------------------- |
| `index.tsx`          | `AudioRecorder`            | Record button, discard control, and transcription wiring |
| `discard-button.tsx` | `DiscardButton`            | Cancel button shown while recording                      |
| `icons.tsx`          | `AudioRecorderButtonIcons` | Icon state for record / stop / sending                   |

## Usage

Pass a `transcribeAction` that accepts a `Blob` and returns `{ text: string }` or an error string:

```tsx
import { transcribeAudioAction } from '@/app/_actions/transcribe'
import { AudioRecorder } from '@/components/examples/audio-recorder'

;<AudioRecorder
  transcribeAction={transcribeAudioAction}
  onTranscription={(text) => setMessage(text)}
  onError={(error) => toast.error(error)}
  onStartRecording={() => console.log('recording started')}
  onStopRecording={() => console.log('recording stopped')}
  onTranscriptStart={() => console.log('transcribing')}
  onTranscriptFinish={() => console.log('transcription finished')}
/>
```

### Custom submit handler

Pass `onSubmit` to override the default record/stop behavior (useful in forms):

```tsx
<AudioRecorder
  transcribeAction={transcribeAudioAction}
  onTranscription={handleTranscription}
  onSubmit={handleFormSubmit}
/>
```

### Styling

Use the `classes` prop to target sub-elements:

```tsx
<AudioRecorder
  transcribeAction={transcribeAudioAction}
  onTranscription={handleTranscription}
  classes={{
    root: 'flex items-center gap-2',
    button: 'rounded-full p-2',
    icons: 'size-5',
    discardButton: 'text-muted-foreground',
  }}
/>
```

## Behavior

- **Record** — requests microphone permission, starts `MediaRecorder`, shows discard button
- **Stop** — stops recording and sends the blob to `transcribeAction` via `useAudioTranscription`
- **Discard** — cancels the current recording (also bound to Escape while recording)
- **Transcribing** — disables the record button and shows the sending aria label

Record button aria labels (Portuguese):

| State        | Label                     |
| ------------ | ------------------------- |
| Idle         | `Gravar áudio`            |
| Recording    | `Parar gravação e enviar` |
| Transcribing | `Enviando áudio...`       |

## Hooks

See [`src/hooks/README.md`](../../../hooks/README.md) for `useAudioRecorder` and `useAudioTranscription` API details.

## Tests

```bash
pnpm test:run src/components/examples/audio-recorder
pnpm test:run src/hooks/__tests__/use-audio-recorder.spec.ts
pnpm test:run src/hooks/__tests__/use-audio-transcription.spec.ts
```
