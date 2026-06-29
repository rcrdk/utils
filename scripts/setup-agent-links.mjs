import { spawnSync } from 'node:child_process'
import { existsSync, lstatSync, mkdirSync, readlinkSync, rmSync, symlinkSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const useColor = process.stdout.isTTY && !process.env.NO_COLOR

const styles = {
	reset: useColor ? '\x1b[0m' : '',
	bold: useColor ? '\x1b[1m' : '',
	dim: useColor ? '\x1b[2m' : '',
	green: useColor ? '\x1b[32m' : '',
	blue: useColor ? '\x1b[34m' : '',
	yellow: useColor ? '\x1b[33m' : '',
	cyan: useColor ? '\x1b[36m' : '',
	red: useColor ? '\x1b[31m' : '',
}

const fmt = (style, text) => (useColor ? `${style}${text}${styles.reset}` : text)

const log = {
	skip: (message) => console.log(fmt(styles.dim, message)),
	title: () => console.log(`\n${fmt(styles.bold, 'Agent symlinks:')}`),
	linkOk: (link, target) =>
		console.log(
			`  ${fmt(styles.green, '✓')} ${fmt(styles.cyan, link)} ${fmt(styles.dim, '→')} ${fmt(styles.dim, target)}`,
		),
	linkCreated: (link, target) =>
		console.log(
			`  ${fmt(styles.blue, '+')} ${fmt(styles.cyan, link)} ${fmt(styles.dim, '→')} ${fmt(styles.dim, target)}`,
		),
	linkUpdated: (link, target) =>
		console.log(
			`  ${fmt(styles.yellow, '↻')} ${fmt(styles.cyan, link)} ${fmt(styles.dim, '→')} ${fmt(styles.dim, target)}`,
		),
	staleRemoved: (count, label) =>
		console.log(
			`  ${fmt(styles.yellow, '!')} removed ${count} stale git index ${label} under ${fmt(styles.cyan, '.cursor/rules')}`,
		),
	error: (message) => console.error(`\n${fmt(styles.red, '✗')} ${fmt(styles.bold, message)}\n`),
	done: ({ created, updated, ok }) => {
		const parts = [
			created > 0 && `${created} created`,
			updated > 0 && `${updated} updated`,
			ok > 0 && `${ok} up to date`,
		].filter(Boolean)

		const summary = parts.length > 0 ? fmt(styles.dim, ` (${parts.join(', ')})`) : ''

		console.log(`\n${fmt(styles.green, '✓')} ${fmt(styles.bold, 'Agent symlinks ready')}${summary}\n`)
	},
}

const isCi = ['1', 'true'].includes(String(process.env.CI ?? '').toLowerCase())

if (isCi) {
	log.skip('Skipping agent symlinks in CI.')
	process.exit(0)
}

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..')

const LINKS = [
	{ link: '.cursor/rules', target: '../agents/rules' },
	{ link: '.cursor/skills', target: '../agents/skills' },
	{ link: '.claude/rules', target: '../agents/rules' },
	{ link: '.claude/skills', target: '../agents/skills' },
	{ link: 'CLAUDE.md', target: 'AGENTS.md' },
	{ link: '.cursorrules', target: 'agents/commit-messages.cursorrules' },
]

const counts = { created: 0, updated: 0, ok: 0 }

const setupLink = (relativeLink, relativeTarget) => {
	const linkPath = join(ROOT, relativeLink)
	const parentDir = dirname(linkPath)

	if (!existsSync(parentDir)) mkdirSync(parentDir, { recursive: true })

	if (existsSync(linkPath)) {
		const stats = lstatSync(linkPath)

		if (!stats.isSymbolicLink()) {
			throw new Error(`${relativeLink} exists and is not a symlink. Remove it manually and run again.`)
		}

		const currentTarget = readlinkSync(linkPath)
		if (currentTarget === relativeTarget) {
			counts.ok += 1
			log.linkOk(relativeLink, relativeTarget)
			return
		}

		rmSync(linkPath)
		symlinkSync(relativeTarget, linkPath)
		counts.updated += 1
		log.linkUpdated(relativeLink, relativeTarget)
		return
	}

	symlinkSync(relativeTarget, linkPath)
	counts.created += 1
	log.linkCreated(relativeLink, relativeTarget)
}

const removeStaleGitIndexEntries = () => {
	const listResult = spawnSync('git', ['ls-files', '.cursor/rules'], { cwd: ROOT, encoding: 'utf8' })

	if (listResult.status !== 0) return

	const trackedFiles = listResult.stdout.trim().split('\n').filter(Boolean)
	if (trackedFiles.length === 0) return

	for (const file of trackedFiles) spawnSync('git', ['update-index', '--force-remove', file], { cwd: ROOT })

	const entryLabel = trackedFiles.length === 1 ? 'entry' : 'entries'
	log.staleRemoved(trackedFiles.length, entryLabel)
}

log.title()

try {
	for (const { link, target } of LINKS) setupLink(link, target)

	removeStaleGitIndexEntries()

	log.done(counts)
} catch (error) {
	const message = error instanceof Error ? error.message : 'Failed to set up agent symlinks.'
	log.error(message)
	process.exit(1)
}
