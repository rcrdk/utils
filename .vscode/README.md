# VS Code settings

Workspace config for TypeScript imports, Tailwind CSS IntelliSense, and recommended extensions. Copy the `.vscode/` folder into your project, or merge individual files into your existing workspace config.

## Files

| File | Purpose |
|------|---------|
| [`settings.json`](./settings.json) | Editor and language-service preferences |
| [`extensions.json`](./extensions.json) | Extension recommendations shown on workspace open |

## Recommended extensions

[`extensions.json`](./extensions.json) prompts teammates to install:

| Extension | ID | Why |
|-----------|----|-----|
| [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) | `bradlc.vscode-tailwindcss` | Class autocomplete, linting, and previews |
| [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) | `dbaeumer.vscode-eslint` | Inline lint diagnostics and auto-fix on save |
| [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) | `esbenp.prettier-vscode` | Format on save aligned with `.prettierrc` |
| [EditorConfig](https://marketplace.visualstudio.com/items?itemName=editorconfig.editorconfig) | `editorconfig.editorconfig` | Applies `.editorconfig` indent and EOL rules |
| [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost) | `wix.vscode-import-cost` | Shows bundle size inline on import statements |
| [Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors) | `yoavbls.pretty-ts-errors` | Readable TypeScript error formatting |

VS Code / Cursor shows an **Install Recommended Extensions** prompt when the workspace is opened. No extra setup beyond accepting that prompt.

## Settings

### Import aliases

```json
"typescript.preferences.importModuleSpecifier": "non-relative"
```

Auto-imports prefer path aliases (e.g. `@/components/foo`) over relative paths (`../../components/foo`). Works best when `paths` is configured in `tsconfig.json`.

### Tailwind class attributes

```json
"tailwindCSS.classAttributes": ["class", "className", "classNameCenter", "containerClassName", "classes"]
```

Tells Tailwind IntelliSense which JSX/HTML attributes hold class names. Add your own prop names here if you use custom wrappers.

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
# Copy the whole folder to another project
cp -r .vscode /path/to/your-project/

# Or copy individual files
cp .vscode/settings.json /path/to/your-project/.vscode/
cp .vscode/extensions.json /path/to/your-project/.vscode/
```

If the target project already has these files, merge the keys and extension IDs manually instead of overwriting.
