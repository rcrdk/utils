export const generateSlug = (entry: string | null | undefined) => {
	if (!entry) return null

	const normalized = entry
		.toString()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()

	const cleaned = normalized
		.replace(/[^a-z0-9 -]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')

	return cleaned
}
