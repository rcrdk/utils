# AI Agent Setup

This project includes configuration for AI coding assistants (Cursor, Claude Code, and similar tools). Rules and guides live in version-controlled files; local symlinks wire them into each tool's expected paths.

## Why symlinks?

Cursor reads rules from `.cursor/rules/`. Claude Code reads from `.claude/rules/`. Both tools also look for root-level files like `AGENTS.md` and `.cursorrules`.

Rather than duplicating content in each location, the source of truth stays in `agents/` and `AGENTS.md`. The `setup:agent-links` script creates symlinks so every tool reads the same files.

Generated symlinks are **not committed** — they are recreated locally after cloning.

## Directory layout

```
AGENTS.md                          # Main agent guide (project context, conventions, Next.js docs index)
README-AGENTS.md                   # This file — human-readable setup guide
agents/
├── rules/                         # Cursor/Claude rules (.mdc files) — source of truth
├── skills/                        # Shared agent skills (optional)
├── commands.md                    # pnpm command reference
├── commit-messages.cursorrules    # Commit message rules for SCM "Generate commit message"
└── README.md                      # Rules index

scripts/
└── setup-agent-links.mjs          # Creates local symlinks (skipped in CI)

# Generated locally (gitignored):
.cursor/rules   -> ../agents/rules
.cursor/skills  -> ../agents/skills
.claude/rules   -> ../agents/rules
.claude/skills  -> ../agents/skills
CLAUDE.md       -> AGENTS.md
.cursorrules    -> agents/commit-messages.cursorrules
```

## First-time setup

```bash
pnpm install
pnpm setup:agent-links
```

Or run `pnpm dev` — the `predev` script runs `setup:agent-links` automatically.

In CI (`CI=true`), the script exits immediately and does nothing.

## Key files

| File                                       | Purpose                                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| [AGENTS.md](./AGENTS.md)                   | Primary guide for AI agents: conventions, project structure, do/don't, Next.js docs index |
| [agents/rules/](./agents/rules/)           | Modular coding rules (TypeScript, React, imports, etc.)                                   |
| [agents/commands.md](./agents/commands.md) | pnpm scripts and git commit format                                                        |
| [agents/README.md](./agents/README.md)     | Index of all rules with descriptions                                                      |
| [README-DX.md](./README-DX.md)             | Linting, formatting, Husky hooks, and editor setup                                        |

## Next.js documentation

`AGENTS.md` includes a docs index for **Next.js 16.2.9**. Agents should read from `node_modules/next/dist/docs/` before making Next.js changes — training data is often outdated.

This project uses the docs bundled with the installed `next` package. **Do not** run `npx @next/codemod agents-md` or create a `.next-docs/` folder — that workflow is for older Next.js versions without bundled docs.

If docs are missing, run `pnpm install` to restore them.

## Editing rules

1. Add or edit `.mdc` files in `agents/rules/` (see [agents/rules/cursor-rules.mdc](./agents/rules/cursor-rules.mdc) for format).
2. Update [agents/README.md](./agents/README.md) if you add a new rule.
3. Symlinks pick up changes immediately — no need to re-run `setup:agent-links` unless a symlink is broken.

To add a rule that applies only to certain files, set `globs` in the rule's YAML front matter. Use `alwaysApply: true` for rules that should apply in every conversation.

## Commit messages

Cursor's **Generate commit message** reads `.cursorrules`, which symlinks to `agents/commit-messages.cursorrules`. Keep that file aligned with [agents/rules/commit-messages.mdc](./agents/rules/commit-messages.mdc).

## Troubleshooting

| Problem                                     | Fix                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------- |
| Rules not showing in Cursor                 | Run `pnpm setup:agent-links` and reload the window                  |
| `.cursor/rules exists and is not a symlink` | Remove the directory manually, then re-run `pnpm setup:agent-links` |
| `CLAUDE.md` out of date                     | It symlinks to `AGENTS.md` — edit `AGENTS.md` instead               |
| Symlinks missing after clone                | Expected — run `pnpm setup:agent-links` or `pnpm dev`               |
