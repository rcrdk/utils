# Developer Experience (DX)

Quick reference for the tooling in this project — linting, formatting, git hooks, TypeScript, and editor setup.

## Overview

```
┌─────────────┐     pre-commit      ┌─────────────┐
│  git commit │ ──────────────────► │ lint-staged │ ──► ESLint --fix + Prettier
└─────────────┘                     └─────────────┘
       │
       │ commit-msg
       ▼
┌─────────────┐
│ commitlint  │ ──► validates Conventional Commits format
└─────────────┘

┌─────────────┐     pre-push        ┌─────────────┐
│  git push   │ ──────────────────► │  typecheck  │ ──► tsc --noEmit
└─────────────┘                     └─────────────┘
```

## Scripts

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `pnpm dev`          | Start Next.js dev server          |
| `pnpm build`        | Production build                  |
| `pnpm lint`         | Run ESLint on `src/**/*.{ts,tsx}` |
| `pnpm lint:fix`     | ESLint with auto-fix              |
| `pnpm format`       | Format all files with Prettier    |
| `pnpm format:check` | Check formatting without writing  |
| `pnpm typecheck`    | TypeScript check (`tsc --noEmit`) |

After `pnpm install`, Husky hooks are enabled automatically via the `prepare` script.

---

## Husky

Git hooks live in [`.husky/`](./.husky/).

| Hook           | Runs                          | Purpose                                    |
| -------------- | ----------------------------- | ------------------------------------------ |
| **pre-commit** | `pnpm lint-staged`            | Lint and format staged files before commit |
| **commit-msg** | `pnpm commitlint --edit "$1"` | Validate commit message format             |
| **pre-push**   | `pnpm typecheck`              | Block push if TypeScript has errors        |

Husky is installed on every `pnpm install` through:

```json
"prepare": "husky"
```

---

## lint-staged

Config: [`.lintstagedrc.json`](./.lintstagedrc.json)

On commit, only **staged** files matching `*.{ts,tsx,js,jsx}` are processed:

1. `eslint --fix`
2. `prettier --write`

This keeps commits fast — the full codebase is not linted on every commit. Run `pnpm lint` manually for a full check.

---

## Commitlint

Config: [`commitlint.config.mjs`](./commitlint.config.mjs)

Enforces [Conventional Commits](https://www.conventionalcommits.org/) via `@commitlint/config-conventional`.

### Allowed types

`build` · `chore` · `ci` · `docs` · `feat` · `fix` · `perf` · `refactor` · `revert` · `style` · `test` · `wip`

### Format

```
<type>: <subject>
```

### Examples

```bash
git commit -m "feat: add user profile page"
git commit -m "fix: handle empty form submission"
git commit -m "docs: update README-DX"
git commit -m "chore: bump dependencies"
```

Invalid messages are rejected by the **commit-msg** hook.

---

## ESLint

Config: [`eslint.config.mjs`](./eslint.config.mjs) (ESLint 9 flat config)

### Base

- **Next.js 16** — `eslint-config-next/core-web-vitals` + `typescript`
- **Prettier** — `eslint-config-prettier` disables conflicting ESLint rules; `eslint-plugin-prettier` reports formatting as lint errors

### Notable rules

| Rule                                         | Level | Notes                                                        |
| -------------------------------------------- | ----- | ------------------------------------------------------------ |
| `prettier/prettier`                          | error | Formatting must match Prettier                               |
| `@typescript-eslint/consistent-type-imports` | error | Use `import type { … }` for types                            |
| `no-restricted-imports`                      | error | Blocks deep relative imports (`../../**`) — use `@/` aliases |
| `import/extensions`                          | error | No file extensions in imports                                |
| `jsx-a11y/*`                                 | warn  | Accessibility checks (incl. Next.js `Image` alt text)        |

### Import aliases

TypeScript path alias `@/*` → `./src/*` (see `tsconfig.json`). ESLint resolves imports via `eslint-import-resolver-typescript`.

---

## Prettier

Config: [`.prettierrc.json`](./.prettierrc.json)  
Ignore: [`.prettierignore`](./.prettierignore)

Prettier reads [`.editorconfig`](./.editorconfig) automatically (indent style, EOL, etc.).

### Style

| Option         | Value  |
| -------------- | ------ |
| Quotes         | Single |
| Semicolons     | Off    |
| Print width    | 120    |
| Trailing comma | All    |

### Plugins

| Plugin                                | Purpose                                                     |
| ------------------------------------- | ----------------------------------------------------------- |
| `@ianvs/prettier-plugin-sort-imports` | Sort imports (React → Next → third-party → `@/` → relative) |
| `prettier-plugin-tailwindcss`         | Sort Tailwind classes; works inside `cn()` and `cva()`      |
| `prettier-plugin-sort-json`           | Sort JSON keys                                              |

---

## TypeScript

Config: [`tsconfig.json`](./tsconfig.json)

| Setting           | Value                                              |
| ----------------- | -------------------------------------------------- |
| Strict mode       | On                                                 |
| Module resolution | `bundler`                                          |
| JSX               | `react-jsx`                                        |
| Path alias        | `@/*` → `./src/*`                                  |
| Emit              | Off (`noEmit: true` — Next.js handles compilation) |

Run `pnpm typecheck` locally or rely on the **pre-push** hook.

---

## EditorConfig

Config: [`.editorconfig`](./.editorconfig)

Shared editor defaults for the team. Install the [EditorConfig extension](https://marketplace.visualstudio.com/items?itemName=editorconfig.editorconfig) (listed in `.vscode/extensions.json`).

| Setting     | `*` (default) | `*.md`        |
| ----------- | ------------- | ------------- |
| Indent      | Tab, size 2   | Space, size 2 |
| End of line | LF            | LF            |
| Charset     | UTF-8         | UTF-8         |

---

## VS Code / Cursor

See [`.vscode/README.md`](./.vscode/README.md) for full details.

### Recommended extensions

[`.vscode/extensions.json`](./.vscode/extensions.json) — ESLint, Prettier, Tailwind IntelliSense, EditorConfig, Import Cost, Pretty TypeScript Errors.

### Workspace settings

[`.vscode/settings.json`](./.vscode/settings.json):

- **TypeScript** — auto-imports prefer `@/` aliases over relative paths
- **Tailwind** — IntelliSense on custom class attributes and inside `cn()` / `cva()`

---

## First-time setup

```bash
pnpm install   # installs deps + enables Husky hooks
```

Open the project in VS Code / Cursor and accept **Install Recommended Extensions** when prompted.

For AI agent setup (Cursor, Claude), see [README-AGENTS.md](./README-AGENTS.md).

---

## Troubleshooting

| Problem                             | Fix                                                                      |
| ----------------------------------- | ------------------------------------------------------------------------ |
| `Command "lint-staged" not found`   | Run `pnpm install`                                                       |
| Commit rejected by commitlint       | Use `type: subject` format (see above)                                   |
| ESLint errors in editor but not CLI | Restart ESLint server: `Cmd+Shift+P` → **ESLint: Restart ESLint Server** |
| Prettier vs ESLint conflict         | Both share `.prettierrc.json` — run `pnpm lint:fix`                      |
| Push blocked by typecheck           | Run `pnpm typecheck` and fix reported errors                             |
| Deep import error                   | Replace `../../foo` with `@/foo`                                         |

---

## Config file index

| Tool         | File                                                        |
| ------------ | ----------------------------------------------------------- |
| ESLint       | `eslint.config.mjs`                                         |
| Prettier     | `.prettierrc.json`, `.prettierignore`                       |
| TypeScript   | `tsconfig.json`                                             |
| EditorConfig | `.editorconfig`                                             |
| Commitlint   | `commitlint.config.mjs`                                     |
| lint-staged  | `.lintstagedrc.json`                                        |
| Husky        | `.husky/pre-commit`, `.husky/commit-msg`, `.husky/pre-push` |
| VS Code      | `.vscode/settings.json`, `.vscode/extensions.json`          |
