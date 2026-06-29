# Command Reference

## Development

```bash
pnpm dev          # Start Next.js dev server (runs setup:agent-links first)
pnpm build        # Production build
pnpm start        # Start production server
```

## Quality

```bash
pnpm typecheck    # TypeScript check (tsc --noEmit)
pnpm lint         # ESLint on src/**/*.ts(x)
pnpm lint:fix     # ESLint with auto-fix
pnpm format       # Prettier write
pnpm format:check # Prettier check
```

## Agents

After cloning, create local symlinks for Cursor and Claude rules (also runs automatically via `predev`):

```bash
pnpm setup:agent-links  # Link .cursor/ and .claude/ to agents/rules and agents/skills
```

## Git

Commits use Conventional Commits and are validated by commitlint on `commit-msg`.

**Format:** `type(scope): subject` or `type: subject`

- **Header** (first `-m`): max **100 characters** (`header-max-length` when configured)
- Allowed types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`, `wip`

When the change centers on a **component or function**, use a **scope** in **camelCase** (the export name). For broader areas (routes, modules, config), use **kebab-case** or omit the scope.

```bash
git commit -m "feat(groupBy): add generic overload"
git commit -m "fix(twCnMerge): handle empty class list"
git commit -m "docs: document agent symlink setup"
git commit -m "chore(setup-agent-links): update symlink script"
```

See [README-DX.md](../README-DX.md) for Husky hooks, lint-staged, and editor setup.
See [README-AGENTS.md](../README-AGENTS.md) for AI agent setup.
