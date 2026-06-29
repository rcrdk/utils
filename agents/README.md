# Utils Agent Documentation Index

- **[../AGENTS.md](../AGENTS.md)** - Main guide (structure, tech stack, commands, examples)
- **[commands.md](commands.md)** - Command reference
- **[../README-DX.md](../README-DX.md)** - Husky, ESLint, Prettier, TypeScript, and editor setup
- **[../README-AGENTS.md](../README-AGENTS.md)** - AI agent setup and symlink guide

## Rules Index

Rules live in [agents/rules/](rules/) and are shared via symlinks in `.cursor/rules` and `.claude/rules`.

Run `pnpm dev` or `pnpm setup:agent-links` locally after cloning (skipped in CI).

### TypeScript & Code Style

- [type-imports](rules/type-imports.mdc) - Type-only imports
- [typescript](rules/typescript.mdc) - Type safety conventions
- [strict-equality](rules/strict-equality.mdc) - Prefer `===` and `!==`
- [naming-conventions](rules/naming-conventions.mdc) - Naming props, constants, and variables
- [function-parameters](rules/function-parameters.mdc) - Object params for functions with 3+ arguments
- [constants-and-variables](rules/constants-and-variables.mdc) - Magic numbers, named returns, and named conditions
- [control-flow](rules/control-flow.mdc) - Early returns, single-statement blocks, no nested ternaries
- [single-responsibility](rules/single-responsibility.mdc) - One responsibility per function
- [deduplication](rules/deduplication.mdc) - Extract shared logic duplicated across functions
- [functional-programming](rules/functional-programming.mdc) - Immutability, pure functions, single-return arrow functions
- [utility-functions](rules/utility-functions.mdc) - Arrow functions exported as const in `src/utils/`
- [optional-chaining](rules/optional-chaining.mdc) - Safe property access
- [array-access](rules/array-access.mdc) - Prefer `.at()` over bracket notation
- [imports](rules/imports.mdc) - Import paths and barrel exports

### React

- [react-components](rules/react-components.mdc) - Component structure, props, JSX conditionals, and styling

### Architecture & Patterns

- [project-structure](rules/project-structure.mdc) - `src/` domain folders vs `src/app/` Next.js routes
- [barrel-exports](rules/barrel-exports.mdc) - Named exports in index files
- [file-naming](rules/file-naming.mdc) - kebab-case file and folder names

### Meta

- [cursor-rules](rules/cursor-rules.mdc) - How to create and maintain Cursor rules
- [package-installation](rules/package-installation.mdc) - Ask before adding, removing, or upgrading dependencies
- [commit-messages](rules/commit-messages.mdc) - Conventional Commits format
