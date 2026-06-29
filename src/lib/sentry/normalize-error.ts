export const normalizeError = (error: unknown): Error => {
	if (error instanceof Error) return error

	if (typeof error === 'string') return new Error(error)

	const hasMessage = typeof error === 'object' && error !== null && 'message' in error
	const message = hasMessage && typeof error.message === 'string' ? error.message : 'Unknown error'
	const normalizedError = new Error(message)

	if (typeof error === 'object' && error !== null && 'name' in error && typeof error.name === 'string')
		normalizedError.name = error.name

	normalizedError.cause = error

	return normalizedError
}
