import 'fake-indexeddb/auto'

import type { PersistedClient } from '@tanstack/query-persist-client-core'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { REACT_QUERY_CACHE_KEY } from '@/config/tanstack-query'

const reportError = vi.hoisted(() => vi.fn())

vi.mock('@/lib/sentry/report-error', () => ({
	reportError,
}))

const persistedClient: PersistedClient = {
	timestamp: Date.now(),
	buster: '',
	clientState: {
		mutations: [],
		queries: [],
	},
}

describe('PersisterMethods', () => {
	beforeEach(async () => {
		vi.resetModules()
		const { removeClient } = await import('@/lib/tanstack-query/persister-methods')

		await removeClient()
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('should persist and restore a Tanstack Query client', async () => {
		const { persistClient, restoreClient } = await import('@/lib/tanstack-query/persister-methods')

		await persistClient(persistedClient)

		const restoredClient = await restoreClient()

		expect(restoredClient).toEqual(persistedClient)
		expect(reportError).not.toHaveBeenCalled()
	})

	it('should return undefined when no cached client exists', async () => {
		const { restoreClient } = await import('@/lib/tanstack-query/persister-methods')

		const restoredClient = await restoreClient()

		expect(restoredClient).toBeUndefined()
	})

	it('should remove a persisted client', async () => {
		const { persistClient, removeClient, restoreClient } = await import('@/lib/tanstack-query/persister-methods')

		await persistClient(persistedClient)
		await removeClient()

		const restoredClient = await restoreClient()

		expect(restoredClient).toBeUndefined()
	})

	it('should report errors when IndexedDB persistence fails', async () => {
		const openSpy = vi.spyOn(indexedDB, 'open').mockImplementation(() => {
			const request = {
				onerror: null as ((event: Event) => void) | null,
				onupgradeneeded: null,
				onsuccess: null as ((event: Event) => void) | null,
				result: null,
				error: new DOMException('open failed'),
			} as unknown as IDBOpenDBRequest

			queueMicrotask(() => request.onerror?.(new Event('error')))

			return request
		})

		const { persistClient } = await import('@/lib/tanstack-query/persister-methods')

		await persistClient(persistedClient)

		expect(reportError).toHaveBeenCalledWith({
			error: expect.any(DOMException),
			message: 'Failed to persist Tanstack Query client',
		})

		openSpy.mockRestore()
	})

	it('should store the client under "REACT_QUERY_CACHE_KEY"', async () => {
		const { persistClient } = await import('@/lib/tanstack-query/persister-methods')

		await persistClient(persistedClient)

		const dbRequest = indexedDB.open('rcrdk-dev', 2)
		const storedEntry = await new Promise<{ key: string; value: PersistedClient } | undefined>((resolve, reject) => {
			dbRequest.onerror = () => reject(dbRequest.error)
			dbRequest.onsuccess = () => {
				const db = dbRequest.result
				const transaction = db.transaction(['react-query'], 'readonly')
				const store = transaction.objectStore('react-query')
				const getRequest = store.get(REACT_QUERY_CACHE_KEY)

				getRequest.onerror = () => reject(getRequest.error)
				getRequest.onsuccess = () => resolve(getRequest.result)
			}
		})

		expect(storedEntry?.key).toBe(REACT_QUERY_CACHE_KEY)
		expect(storedEntry?.value).toEqual(persistedClient)
	})
})
