type Groupable = PropertyKey | boolean

type AsRecordKey<T> = T extends boolean ? `${T}` : T extends PropertyKey ? T : string

export const groupBy = <T extends Record<K, Groupable>, K extends keyof T>(collection: T[], key: K) => {
	const grouped = collection.reduce(
		(previous, current) => {
			const groupKey = current[key] as AsRecordKey<T[K]>

			if (!previous[groupKey]) previous[groupKey] = [] as T[]

			previous[groupKey].push(current)
			return previous
		},
		{} as Record<AsRecordKey<T[K]>, T[]>,
	)

	return grouped
}
