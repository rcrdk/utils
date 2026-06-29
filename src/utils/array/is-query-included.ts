const normalizeAndClean = (str: string): string =>
	str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.trim()
		.toLowerCase()

export const isQueryIncluded = (query: string | null | undefined, stringToCompare: string | null | undefined) => {
	if (!query || !stringToCompare) return false

	const normalizedQuery = normalizeAndClean(query)
	const normalizedStringToCompare = normalizeAndClean(stringToCompare)

	const index = normalizedStringToCompare.indexOf(normalizedQuery)

	if (index !== -1) {
		const matchedSubstring = normalizedStringToCompare.slice(index, index + normalizedQuery.length)
		return matchedSubstring.localeCompare(normalizedQuery, undefined, { sensitivity: 'base' }) === 0
	}

	return false
}
