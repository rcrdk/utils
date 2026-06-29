# rcrdk/utils

Personal utilities collection with a [Next.js 16](https://nextjs.org) app shell for local development and demos. Reusable code lives under `src/`; routing and route-local UI stay in `src/app/`.

## Tech stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **Package manager**: pnpm

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Agent symlinks are recreated automatically on `pnpm dev` (see [README-AGENTS.md](./README-AGENTS.md)).

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Next.js dev server |
| `pnpm build` | Production build |
| `pnpm typecheck` | Run TypeScript (`tsc --noEmit`) |
| `pnpm lint` | Lint `src/**/*.{ts,tsx}` |
| `pnpm lint:fix` | Lint with auto-fix |

See [README-DX.md](./README-DX.md) for the full tooling reference (Prettier, Husky, commitlint, editor setup).

## Project structure

```
src/
├── app/          # Next.js App Router — pages, layout, route-local UI
├── components/   # Shared React components
├── hooks/        # Shared React hooks
├── utils/        # Pure utility functions
├── config/       # App configuration
└── styles/       # Global CSS and design tokens
```

## Documentation

| README | Description |
| --- | --- |
| [src/utils/README.md](./src/utils/README.md) | Pure helpers organized by domain (`array/`, `string/`, `ui/`, `action/`) — `groupBy`, `generateSlug`, `cn`, server action wrappers, and more |
| [src/components/README.md](./src/components/README.md) | Shared React components — conventions, index, and usage (e.g. polymorphic `Text` with an `as` prop) |
| [src/hooks/README.md](./src/hooks/README.md) | Shared React hooks — debounce, clipboard, geolocation, IndexedDB, and conventions for adding new hooks |
| [README-DX.md](./README-DX.md) | Developer experience — ESLint, Prettier, Husky, lint-staged, commitlint, TypeScript, editor setup |
| [README-AGENTS.md](./README-AGENTS.md) | AI agent setup — rules, symlinks, and `agents/` directory layout |
| [AGENTS.md](./AGENTS.md) | Agent guide — project conventions, commands, and Next.js docs index |

## Conventions

- **File names**: kebab-case
- **Exports**: named only — no default exports
- **Imports**: `@/` alias for paths under `src/`
- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) (`type(scope): subject`)

Coding rules live in [agents/rules/](./agents/rules/). After cloning, run `pnpm setup:agent-links` or `pnpm dev` to wire them into Cursor and Claude Code locally.
