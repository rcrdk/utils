# AI Agent Setup

This project includes configuration for AI coding assistants (Cursor, Claude Code, and similar tools). Rules and guides live in version-controlled files; local symlinks wire them into each tool's expected paths.

## Why symlinks?

Cursor reads rules from `.cursor/rules/`. Claude Code reads from `.claude/rules/`. Both tools also look for root-level files like `AGENTS.md` and `.cursorrules`.

Rather than duplicating content in each location, the source of truth stays in `agents/` and `AGENTS.md`, and the `setup:agent-links` script creates symlinks so every tool reads the same files.

Rules, personas, commands, and skills are **committed files in this repository**. They originated in **[agent-kit](https://github.com/rcrdk/agent-kit)** and were copied in by hand — there are no git submodules, and nothing is fetched at install time.

Generated symlinks are **not committed** — they are recreated locally after cloning.

## Directory layout

```
AGENTS.md                          # Main agent guide (project context, conventions, Next.js docs index)
README-AGENTS.md                   # This file — human-readable setup guide
agents/                            # Committed — the source of truth
├── rules/                         # Coding + workflow rules (.mdc)
├── personas/                      # Workflow personas (/plan, /do, /review, …)
├── commands/                      # rcrdk-* slash command macros
├── skills/                        # Skills (SKILL.md per folder)
├── commands.md                    # pnpm command reference
├── commit-messages.cursorrules    # Generated — commit rules for SCM "Generate commit message"
└── README.md                      # Rules index

scripts/
└── setup-agent-links.mjs          # Creates local symlinks + generated files (skipped in CI)

# Generated locally (gitignored):
.cursor/rules    -> ../agents/rules
.cursor/skills   -> ../agents/skills
.cursor/commands -> ../agents/commands
.cursor/agents   -> ../agents/personas
.claude/rules    -> ../agents/rules
.claude/skills   -> ../agents/skills
.claude/commands -> ../agents/commands
.claude/agents   -> ../agents/personas
CLAUDE.md        -> AGENTS.md
.cursorrules     -> agents/commit-messages.cursorrules
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
| [agents/rules/](./agents/rules/)           | Coding and workflow rules                                                                 |
| [agents/personas/](./agents/personas/)     | Workflow personas                                                                         |
| [agents/commands/](./agents/commands/)     | Slash command macros                                                                      |
| [agents/commands.md](./agents/commands.md) | pnpm scripts and git commit format                                                        |
| [agents/README.md](./agents/README.md)     | Index of all rules with descriptions                                                      |
| [README-DX.md](./README-DX.md)             | Linting, formatting, Husky hooks, and editor setup                                        |

## Next.js documentation

`AGENTS.md` includes a docs index for **Next.js 16.4.4**. Agents should read from `node_modules/next/dist/docs/` before making Next.js changes — training data is often outdated.

This project uses the docs bundled with the installed `next` package. **Do not** run `npx @next/codemod agents-md` or create a `.next-docs/` folder — that workflow is for older Next.js versions without bundled docs.

If docs are missing, run `pnpm install` to restore them.

## Editing rules

1. Edit the `.mdc` file directly in [agents/rules/](./agents/rules/).
2. Re-run `pnpm setup:agent-links` — it rebuilds the rules index in `AGENTS.md` and `agents/commit-messages.cursorrules`.
3. Mirror anything reusable back into [agent-kit](https://github.com/rcrdk/agent-kit) so other projects can copy it.

To add a rule that applies only to certain files, set `globs` in the rule's YAML front matter. Use `alwaysApply: true` for rules that should apply in every conversation.

## Slash commands and personas

Add or edit `.md` files in [agents/commands/](./agents/commands/) or [agents/personas/](./agents/personas/) with YAML front matter (`name`, `description`). They are picked up through the `.cursor/` and `.claude/` symlinks — no regeneration needed, though a window reload is.

## Syncing with agent-kit

There is no automatic sync. To pull newer shared content, copy the matching folders out of an agent-kit checkout and re-run the link script:

```bash
KIT=../agent-kit                      # path to your agent-kit clone
cp "$KIT"/rules/*.mdc agents/rules/
cp "$KIT"/personas/*.md agents/personas/
cp "$KIT"/commands/rcrdk-*.md agents/commands/
cp -R "$KIT"/skills/* agents/skills/
pnpm setup:agent-links
```

Review the diff before committing — local edits in `agents/` are intentional and get overwritten by a blind copy.

## Commit messages

Cursor's **Generate commit message** reads `.cursorrules`, which symlinks to `agents/commit-messages.cursorrules`. That file is generated from [agents/rules/commit-messages.mdc](./agents/rules/commit-messages.mdc) — edit the rule, not the generated file.

## Troubleshooting

| Problem                                        | Fix                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| Rules not showing in Cursor                    | Run `pnpm setup:agent-links` and reload the window                  |
| Slash commands not showing in Cursor           | Run `pnpm setup:agent-links` and reload the window                  |
| Skills not showing in Cursor                   | Run `pnpm setup:agent-links` and reload the window                  |
| `.cursor/rules exists and is not a symlink`    | Remove the directory manually, then re-run `pnpm setup:agent-links` |
| `.cursor/commands exists and is not a symlink` | Remove the directory manually, then re-run `pnpm setup:agent-links` |
| `CLAUDE.md` out of date                        | It symlinks to `AGENTS.md` — edit `AGENTS.md` instead               |
| Rules index in `AGENTS.md` stale               | Run `pnpm setup:agent-links` — it rebuilds the marked block         |
| Symlinks missing after clone                   | Expected — run `pnpm setup:agent-links` or `pnpm dev`               |
