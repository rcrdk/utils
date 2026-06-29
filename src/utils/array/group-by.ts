export const groupBy = <T extends Record<K, PropertyKey>, K extends keyof T>(collection: T[], key: K) => {
	const grouped = collection.reduce(
		(previous, current) => {
			if (!previous[current[key]]) {
				previous[current[key]] = [] as T[]
			}

			previous[current[key]].push(current)
			return previous
		},
		{} as Record<T[K], T[]>,
	)

	return grouped
}
