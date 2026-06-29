# Components

Shared React components used across routes. Route-local UI stays in `src/app/_components/`.

## Conventions

- **Location**: `src/components/` (one component per file, or a subfolder when tests are added)
- **File names**: kebab-case (`component-as-prop.tsx`)
- **Exports**: named exports only — no default exports
- **Props**: `interface` for simple shapes; wrap with `Readonly` in the function signature
- **Imports**: use `@/components/...`

See [react-components](../../agents/rules/react-components.mdc) for full rules (styling, accessibility, JSX conditionals).

## Index

| File                    | Export | Description                                  |
| ----------------------- | ------ | -------------------------------------------- |
| `component-as-prop.tsx` | `Text` | Polymorphic text component with an `as` prop |

## Usage

### `Text` — polymorphic `as` prop

Renders as a `<p>` by default, or as any element/component passed via `as`. Inherits that element's props.

```tsx
import { Text } from '@/components/component-as-prop'

<Text>Default paragraph</Text>

<Text as="span" className="font-medium">
  Inline label
</Text>

<Text as="h1" id="title">
  Page heading
</Text>
```

## Adding a new component

1. Create a kebab-case file in `src/components/`
2. Export a named function component with `Readonly` props
3. Update this README index
