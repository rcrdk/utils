import { spawnSync } from 'node:child_process'
import {
	existsSync,
	lstatSync,
	mkdirSync,
	readdirSync,
	readlinkSync,
	rmSync,
	symlinkSync,
} from 'node:fs'
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
	subtitle: (message) => console.log(fmt(styles.dim, `\n  ${message}`)),
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
	linkRemoved: (link) => console.log(`  ${fmt(styles.yellow, '-')} ${fmt(styles.cyan, link)} ${fmt(styles.dim, '(removed stale link)')}`),
	staleRemoved: (count, label, path) =>
		console.log(
			`  ${fmt(styles.yellow, '!')} removed ${count} stale git index ${label} under ${fmt(styles.cyan, path)}`,
		),
	warn: (message) => console.log(`  ${fmt(styles.yellow, '!')} ${message}`),
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
const AGENT_KIT_PATH = '.agents/agent-kit'
const AGENT_KIT_PROJECT = 'utils'
const RULES_LINK_DIR = 'agents/rules'
const COMMANDS_LINK_DIR = 'agents/commands'

const LINKS = [
	{ link: '.cursor/rules', target: '../agents/rules' },
	{ link: '.cursor/skills', target: '../agents/skills' },
	{ link: '.cursor/commands', target: '../agents/commands' },
	{ link: '.claude/rules', target: '../agents/rules' },
	{ link: '.claude/skills', target: '../agents/skills' },
	{ link: 'CLAUDE.md', target: 'AGENTS.md' },
	{ link: '.cursorrules', target: 'agents/commit-messages.cursorrules' },
]

const counts = { created: 0, updated: 0, ok: 0 }

const pathExists = (path) => {
	try {
		lstatSync(path)
		return true
	} catch {
		return false
	}
}

const setupLink = (relativeLink, relativeTarget) => {
	const linkPath = join(ROOT, relativeLink)
	const parentDir = dirname(linkPath)

	if (!existsSync(parentDir)) mkdirSync(parentDir, { recursive: true })

	if (pathExists(linkPath)) {
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

		rmSync(linkPath, { force: true })
		symlinkSync(relativeTarget, linkPath)
		counts.updated += 1
		log.linkUpdated(relativeLink, relativeTarget)
		return
	}

	symlinkSync(relativeTarget, linkPath)
	counts.created += 1
	log.linkCreated(relativeLink, relativeTarget)
}

const setupManagedLink = (relativeLink, relativeTarget) => {
	const linkPath = join(ROOT, relativeLink)
	const parentDir = dirname(linkPath)

	if (!existsSync(parentDir)) mkdirSync(parentDir, { recursive: true })

	if (pathExists(linkPath)) {
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

		rmSync(linkPath, { force: true })
		symlinkSync(relativeTarget, linkPath)
		counts.updated += 1
		log.linkUpdated(relativeLink, relativeTarget)
		return
	}

	symlinkSync(relativeTarget, linkPath)
	counts.created += 1
	log.linkCreated(relativeLink, relativeTarget)
}

const listAgentKitFiles = (directoryPath, extension) => {
	if (!existsSync(directoryPath)) return []

	return readdirSync(directoryPath, { withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith(extension))
		.map((entry) => entry.name)
}

const setupAgentKitLinks = ({ linkDir, kitFolder, fileExtension, itemLabel, projectAtRoot = false }) => {
	const linkDirectoryPath = join(ROOT, linkDir)
	const agentKitRootPath = join(ROOT, AGENT_KIT_PATH)
	const sharedPath = join(agentKitRootPath, kitFolder, 'shared')
	const projectPath = projectAtRoot
		? join(agentKitRootPath, kitFolder)
		: join(agentKitRootPath, kitFolder, AGENT_KIT_PROJECT)

	if (!existsSync(agentKitRootPath)) {
		log.warn(`agent-kit not found at ${AGENT_KIT_PATH} — run pnpm setup:submodules`)
		return
	}

	if (!existsSync(linkDirectoryPath)) mkdirSync(linkDirectoryPath, { recursive: true })

	const expectedLinks = new Map()

	const linkFile = (fileName, folder) => {
		const relativeLink = `${linkDir}/${fileName}`
		const relativeTarget = folder
			? `../../${AGENT_KIT_PATH}/${kitFolder}/${folder}/${fileName}`
			: `../../${AGENT_KIT_PATH}/${kitFolder}/${fileName}`

		expectedLinks.set(relativeLink, relativeTarget)
		setupManagedLink(relativeLink, relativeTarget)
	}

	const sharedFiles = listAgentKitFiles(sharedPath, fileExtension)

	if (sharedFiles.length > 0) {
		log.subtitle(`agent-kit ${itemLabel} shared (${sharedFiles.length})`)

		for (const fileName of sharedFiles) linkFile(fileName, 'shared')
	}

	const projectFiles = listAgentKitFiles(projectPath, fileExtension)

	if (projectFiles.length > 0) {
		const projectLabel = projectAtRoot ? itemLabel : `${itemLabel} ${AGENT_KIT_PROJECT}`
		log.subtitle(`agent-kit ${projectLabel} (${projectFiles.length})`)

		for (const fileName of projectFiles) {
			linkFile(fileName, projectAtRoot ? null : AGENT_KIT_PROJECT)
		}
	}

	for (const entry of readdirSync(linkDirectoryPath, { withFileTypes: true })) {
		if (entry.name === 'README.md') continue
		if (!entry.isSymbolicLink()) continue

		const relativeLink = `${linkDir}/${entry.name}`
		if (expectedLinks.has(relativeLink)) continue

		rmSync(join(linkDirectoryPath, entry.name))
		log.linkRemoved(relativeLink)
	}
}

const removeStaleGitIndexEntries = () => {
	const stalePaths = ['.cursor/rules', '.cursor/commands', 'agents/rules', 'agents/commands']

	for (const stalePath of stalePaths) {
		const listResult = spawnSync('git', ['ls-files', stalePath], { cwd: ROOT, encoding: 'utf8' })

		if (listResult.status !== 0) continue

		const trackedFiles = listResult.stdout.trim().split('\n').filter(Boolean)
		if (trackedFiles.length === 0) continue

		for (const file of trackedFiles) {
			if (file.endsWith('agents/rules/README.md')) continue
			if (file.endsWith('agents/commands/README.md')) continue
			spawnSync('git', ['update-index', '--force-remove', file], { cwd: ROOT })
		}

		const entryLabel = trackedFiles.length === 1 ? 'entry' : 'entries'
		log.staleRemoved(trackedFiles.length, entryLabel, stalePath)
	}
}

log.title()

try {
	for (const { link, target } of LINKS) setupLink(link, target)

	setupAgentKitLinks({
		linkDir: RULES_LINK_DIR,
		kitFolder: 'rules',
		fileExtension: '.mdc',
		itemLabel: 'rules',
	})
	setupAgentKitLinks({
		linkDir: COMMANDS_LINK_DIR,
		kitFolder: 'commands',
		fileExtension: '.md',
		itemLabel: 'commands',
		projectAtRoot: true,
	})

	removeStaleGitIndexEntries()

	log.done(counts)
} catch (error) {
	const message = error instanceof Error ? error.message : 'Failed to set up agent symlinks.'
	log.error(message)
	process.exit(1)
}
