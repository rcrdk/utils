# AI Agent Setup

This project includes configuration for AI coding assistants (Cursor, Claude Code, and similar tools). Rules and guides live in version-controlled files; local symlinks wire them into each tool's expected paths.

## Why symlinks?

Cursor reads rules from `.cursor/rules/`. Claude Code reads from `.claude/rules/`. Both tools also look for root-level files like `AGENTS.md` and `.cursorrules`.

Rather than duplicating content in each location, the source of truth stays in `agents/` and `AGENTS.md`. Coding rules live in the **[agent-kit](https://github.com/rcrdk/agent-kit)** submodule (`.agents/agent-kit`). The `setup:agent-links` script creates symlinks so every tool reads the same files.

Generated symlinks are **not committed** — they are recreated locally after cloning.

## Directory layout

```
AGENTS.md                          # Main agent guide (project context, conventions, Next.js docs index)
README-AGENTS.md                   # This file — human-readable setup guide
agents/
├── rules/                         # Generated symlinks → .agents/agent-kit (shared + utils overrides)
├── skills/                        # Shared agent skills (optional)
├── commands/                      # Generated symlinks → .agents/agent-kit/commands/
├── commands.md                    # pnpm command reference
├── commit-messages.cursorrules    # Commit message rules for SCM "Generate commit message"
└── README.md                      # Rules index

scripts/
├── setup-agent-links.mjs          # Creates local symlinks (skipped in CI)
└── setup-submodules.mjs           # git submodule update --init --recursive (skipped in CI)

.agents/
└── agent-kit/                     # Shared Cursor/Claude rules ([rcrdk/agent-kit](https://github.com/rcrdk/agent-kit))

# Generated locally (gitignored):
.cursor/rules    -> ../agents/rules
.cursor/skills   -> ../agents/skills
.cursor/commands -> ../agents/commands
.claude/rules    -> ../agents/rules
.claude/skills   -> ../agents/skills
CLAUDE.md        -> AGENTS.md
.cursorrules     -> agents/commit-messages.cursorrules
```

## First-time setup

```bash
pnpm install          # runs setup:submodules via prepare
pnpm setup:agents     # submodules + agent symlinks
```

Or run `pnpm dev` — the `predev` script runs `setup:agent-links` automatically.

In CI (`CI=true`), the script exits immediately and does nothing.

## Key files

| File                                       | Purpose                                                                                   |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| [AGENTS.md](./AGENTS.md)                   | Primary guide for AI agents: conventions, project structure, do/don't, Next.js docs index |
| [agents/rules/](./agents/rules/)           | Generated rule symlinks — edit [agent-kit](https://github.com/rcrdk/agent-kit) instead    |
| [agents/commands.md](./agents/commands.md) | pnpm scripts and git commit format                                                        |
| [agents/commands/](./agents/commands/)     | Generated slash command symlinks — edit [agent-kit](https://github.com/rcrdk/agent-kit)   |
| [agents/README.md](./agents/README.md)     | Index of all rules with descriptions                                                      |
| [README-DX.md](./README-DX.md)             | Linting, formatting, Husky hooks, and editor setup                                        |

## Next.js documentation

`AGENTS.md` includes a docs index for **Next.js 16.2.9**. Agents should read from `node_modules/next/dist/docs/` before making Next.js changes — training data is often outdated.

This project uses the docs bundled with the installed `next` package. **Do not** run `npx @next/codemod agents-md` or create a `.next-docs/` folder — that workflow is for older Next.js versions without bundled docs.

If docs are missing, run `pnpm install` to restore them.

## Editing rules

1. Edit rules in [agent-kit](https://github.com/rcrdk/agent-kit) (`rules/shared/` or `rules/utils/`). Run `pnpm setup:agent-links` after updating the submodule.
2. Update [agents/README.md](./agents/README.md) if you add a new rule file.
3. Re-run `pnpm setup:agent-links` after pulling agent-kit changes that add or rename rules.

To add a rule that applies only to certain files, set `globs` in the rule's YAML front matter. Use `alwaysApply: true` for rules that should apply in every conversation.

## Slash commands

Edit slash commands in [agent-kit](https://github.com/rcrdk/agent-kit) (`commands/`). `setup-agent-links` symlinks them into `agents/commands/` and `.cursor/commands`.

1. Add or edit `.md` files in agent-kit with YAML front matter (`name`, `description`).
2. Update [agents/README.md](./agents/README.md) when you add a new command.
3. Re-run `pnpm setup:agent-links` after pulling agent-kit changes that add or rename commands.

## Commit messages

Cursor's **Generate commit message** reads `.cursorrules`, which symlinks to `agents/commit-messages.cursorrules`. Keep that file aligned with [agents/rules/commit-messages.mdc](./agents/rules/commit-messages.mdc).

## Troubleshooting

| Problem                                        | Fix                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| Rules not showing in Cursor                    | Run `pnpm setup:agent-links` and reload the window                  |
| Slash commands not showing in Cursor           | Run `pnpm setup:agent-links` and reload the window                  |
| `.cursor/rules exists and is not a symlink`    | Remove the directory manually, then re-run `pnpm setup:agent-links` |
| `.cursor/commands exists and is not a symlink` | Remove the directory manually, then re-run `pnpm setup:agent-links` |
| `CLAUDE.md` out of date                        | It symlinks to `AGENTS.md` — edit `AGENTS.md` instead               |
| Symlinks missing after clone                   | Expected — run `pnpm setup:agent-links` or `pnpm dev`               |
