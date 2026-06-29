# VS Code settings

Workspace settings for TypeScript imports and Tailwind CSS IntelliSense. Copy `settings.json` into your project's `.vscode/` folder, or merge these entries into your existing workspace config.

## Prerequisites

Install these extensions in VS Code / Cursor:

- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

TypeScript settings work with the built-in TypeScript language service — no extra extension required.

## Settings

### Import aliases

```json
"typescript.preferences.importModuleSpecifier": "non-relative"
```

Auto-imports prefer path aliases (e.g. `@/components/foo`) over relative paths (`../../components/foo`). Works best when `paths` is configured in `tsconfig.json`.

### Tailwind class attributes

```json
"tailwindCSS.classAttributes": ["class", "className", "classNameCenter"]
```

Tells Tailwind IntelliSense which JSX/HTML attributes hold class names. Add your own prop names here if you use custom wrappers (e.g. `containerClassName`).

### Tailwind class regex

```json
"tailwindCSS.experimental.classRegex": [
  ["cva\\(([^)]*)\\)", "'([^']*)'"],
  ["cn\\(([^)]*)\\)", "'([^']*)'"]
]
```

Enables autocomplete inside helper functions that wrap class strings:

| Pattern | Matches |
|---------|---------|
| `cva(...)` | [class-variance-authority](https://cva.style/docs) variant definitions |
| `cn(...)` | [`clsx`](https://github.com/lukeed/clsx) + [`tailwind-merge`](https://github.com/dcastil/tailwind-merge) utilities |

**Example** — IntelliSense works inside:

```tsx
<div className={cn('flex items-center', isActive && 'bg-blue-500')} />
const button = cva('rounded-md', { variants: { size: { sm: 'px-2 py-1' } } })
```

To support more helpers, add a regex pair: first captures the function call, second captures the quoted class string inside it.

## Usage

```bash
# Copy to another project
cp -r .vscode/settings.json /path/to/your-project/.vscode/
```

If the target project already has a `settings.json`, merge the keys above manually instead of overwriting the whole file.
