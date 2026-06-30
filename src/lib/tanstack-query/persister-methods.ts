import type { PersistedClient } from '@tanstack/query-persist-client-core'

import { INDEXED_DB_CONFIG } from '@/config/indexeddb'
import { REACT_QUERY_CACHE_KEY } from '@/config/tanstack-query'
import { reportError } from '@/lib/sentry/report-error'

const openIndexedDB = (): Promise<IDBDatabase> => {
	const { DB_NAME, DB_VERSION } = INDEXED_DB_CONFIG

	const promise: Promise<IDBDatabase> = new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION)

		request.onupgradeneeded = (event) => {
			const db = request.result
			const oldVersion = event.oldVersion

			if (oldVersion < INDEXED_DB_CONFIG.DB_VERSION)
				for (const storeName of Array.from(db.objectStoreNames)) db.deleteObjectStore(storeName)

			for (const { name, options } of INDEXED_DB_CONFIG.STORES)
				if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, options)
		}

		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error)
	})

	return promise
}

const promisifyRequest = <T>(request: IDBRequest<T>): Promise<T> =>
	new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error)
	})

export const persistClient = async (client: PersistedClient) => {
	try {
		const db = await openIndexedDB()

		const transaction = db.transaction(['react-query'], 'readwrite')
		const store = transaction.objectStore('react-query')

		await promisifyRequest(store.put({ key: REACT_QUERY_CACHE_KEY, value: client }))
	} catch (error) {
		reportError({ error, message: 'Failed to persist Tanstack Query client' })
	}
}

export const restoreClient = async (): Promise<PersistedClient | undefined> => {
	try {
		const db = await openIndexedDB()

		const transaction = db.transaction(['react-query'], 'readonly')
		const store = transaction.objectStore('react-query')

		const result = await promisifyRequest<{ key: string; value: PersistedClient } | undefined>(
			store.get(REACT_QUERY_CACHE_KEY),
		)

		if (result?.value) return result.value
	} catch (error) {
		reportError({ error, message: 'Failed to restore Tanstack Query client' })
	}
}

export const removeClient = async () => {
	try {
		const db = await openIndexedDB()

		const transaction = db.transaction(['react-query'], 'readwrite')
		const store = transaction.objectStore('react-query')

		await promisifyRequest(store.delete(REACT_QUERY_CACHE_KEY))
	} catch (error) {
		reportError({ error, message: 'Failed to remove Tanstack Query client' })
	}
}
