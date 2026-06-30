import { useEffect, useState } from 'react'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { defaultShouldDehydrateQuery, type Query } from '@tanstack/react-query'

import { REACT_QUERY_CONFIG } from '@/config/tanstack-query'
import { reportError } from '@/lib/sentry/report-error'
import { queryClient } from '@/lib/tanstack-query'
import { createQueryClientPersister } from '@/lib/tanstack-query/persister'

type StartQueryClientPersistenceParams = {
	onRestored: VoidFunction
}

const skipCacheRestore = process.env.SKIP_CACHE_RESTORE === 'true'

const isServer = () => typeof window === 'undefined'
const hasIndexedDB = () => !isServer() && Boolean(window.indexedDB)
const canPersistQueryClient = () => !skipCacheRestore && hasIndexedDB()
const shouldWaitForRestore = (isRestored: boolean) => !skipCacheRestore && (isServer() || hasIndexedDB()) && !isRestored

const shouldDehydrateQuery = (query: Query) =>
	query.meta?.persist === false ? false : defaultShouldDehydrateQuery(query)

const startQueryClientPersistence = ({ onRestored }: Readonly<StartQueryClientPersistenceParams>) => {
	const persister = createQueryClientPersister()

	const [unsubscribe, restorePromise] = persistQueryClient({
		queryClient,
		persister,
		maxAge: REACT_QUERY_CONFIG.gcTime,
		dehydrateOptions: { shouldDehydrateQuery },
	})

	const restoreQueryClient = async () => {
		try {
			await restorePromise
		} catch (error) {
			reportError({ error, message: 'Failed to restore Tanstack Query client' })
		} finally {
			onRestored()
		}
	}

	void restoreQueryClient()

	return unsubscribe
}

export const useQueryClientRestore = () => {
	const [isRestored, setIsRestored] = useState(false)

	useEffect(() => {
		if (!canPersistQueryClient()) return

		const unsubscribe = startQueryClientPersistence({ onRestored: () => setIsRestored(true) })

		return unsubscribe
	}, [])

	const isWaitingForRestore = shouldWaitForRestore(isRestored)

	return isWaitingForRestore
}
