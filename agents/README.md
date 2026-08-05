# Agent Documentation Index

- **[../AGENTS.md](../AGENTS.md)** — main guide (structure, tech stack, commands, examples); `CLAUDE.md` symlinks to it
- **[commands.md](commands.md)** — package manager and git command reference
- **[rules/](rules/)** — coding rules symlinked from [agent-kit](https://github.com/rcrdk/agent-kit)
- **[commands/](commands/)** — slash commands symlinked from agent-kit
- **[skills/](skills/)** — skills available to Cursor and Claude Code

## How agent context is wired

| Surface        | Cursor                                                                    | Claude Code                                           |
| -------------- | ------------------------------------------------------------------------- | ----------------------------------------------------- |
| Rules          | `.cursor/rules` → `agents/rules/` (`.mdc` front matter drives activation) | imported from `AGENTS.md` — see its **Rules** section |
| Main guide     | `AGENTS.md`                                                               | `CLAUDE.md` → `AGENTS.md`                             |
| Slash commands | `.cursor/commands` → `agents/commands/`                                   | `.claude/commands` → `agents/commands/`               |
| Skills         | `.cursor/skills`                                                          | `.claude/skills`                                      |

All symlinks are generated locally by the `setup:agent-links` script and are not committed.

## Editing

Rules, slash commands, and the injected blocks in `AGENTS.md` come from [agent-kit](https://github.com/rcrdk/agent-kit) — edit them there, bump the submodule, then rerun `setup:agents`.

Project-specific guidance goes in `AGENTS.md` **outside** the `<!-- BEGIN:agent-kit-* -->` markers.
