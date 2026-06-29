import { useCallback, useEffect, useRef, useState } from 'react'

import { INDEXED_DB_CONFIG, type IndexedDBStoresNames } from '@/config/indexeddb'

// TODO: Add error reporting to a bug tracking system
const reportError = (error: unknown) => {
	console.error('Failed to open database:', error)
}

const wrapRequest = <T>(request: IDBRequest<T>): Promise<T> =>
	new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result)
		request.onerror = () => reject(request.error)
	})

export const useIndexedDB = () => {
	const [isDatabaseReady, setIsStorageReady] = useState(false)

	const dbRef = useRef<IDBDatabase | null>(null)
	const initializationRef = useRef<Promise<void> | null>(null)

	const { DB_NAME, DB_VERSION, STORES } = INDEXED_DB_CONFIG

	const openDB = useCallback((): Promise<IDBDatabase> => {
		const request = indexedDB.open(DB_NAME, DB_VERSION)

		request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
			const db = request.result
			const oldVersion = event.oldVersion

			if (oldVersion < DB_VERSION)
				for (const storeName of Array.from(db.objectStoreNames)) db.deleteObjectStore(storeName)

			STORES.map(({ name, options }) => db.createObjectStore(name, options))
		}

		return wrapRequest(request)
	}, [DB_NAME, DB_VERSION, STORES])

	const initializeDB = useCallback(async () => {
		if (initializationRef.current) {
			await initializationRef.current
			return
		}

		if (dbRef.current && isDatabaseReady) return

		initializationRef.current = (async () => {
			try {
				const db = await openDB()
				dbRef.current = db
				setIsStorageReady(true)
			} catch (error) {
				reportError(error)
				setIsStorageReady(false)
			} finally {
				initializationRef.current = null
			}
		})()

		await initializationRef.current
	}, [openDB, isDatabaseReady])

	useEffect(() => {
		if (dbRef.current) {
			setIsStorageReady(true)
			return
		}

		void initializeDB()
	}, [initializeDB])

	const getStore = (storeName: IndexedDBStoresNames, mode: IDBTransactionMode = 'readonly') => {
		if (!dbRef.current) throw new Error('Database not ready')
		return dbRef.current.transaction(storeName, mode).objectStore(storeName)
	}

	const waitForReady = useCallback(async () => {
		if (isDatabaseReady && dbRef.current) return

		if (initializationRef.current) await initializationRef.current
		else await initializeDB()
	}, [isDatabaseReady, initializeDB])

	const add = async <T>(
		storeName: IndexedDBStoresNames,
		value: T,
		key?: IDBValidKey,
	): Promise<IDBValidKey | undefined> => {
		await waitForReady()
		const store = getStore(storeName, 'readwrite')
		return wrapRequest(store.add(value, key))
	}

	const put = async <T>(
		storeName: IndexedDBStoresNames,
		value: T,
		key?: IDBValidKey,
	): Promise<IDBValidKey | undefined> => {
		await waitForReady()
		const store = getStore(storeName, 'readwrite')
		return wrapRequest(store.put(value, key))
	}

	const upsert = async <T>(
		storeName: IndexedDBStoresNames,
		value: T,
		key?: IDBValidKey,
	): Promise<IDBValidKey | undefined> => {
		try {
			return await add(storeName, value, key)
		} catch (error) {
			if (!(error instanceof DOMException) || error.name !== 'ConstraintError') throw error
			return put(storeName, value, key)
		}
	}

	const getItem = async <T>(storeName: IndexedDBStoresNames, key: IDBValidKey): Promise<T | undefined> => {
		await waitForReady()
		const store = getStore(storeName)
		return wrapRequest(store.get(key))
	}

	const getAll = async <T>(storeName: IndexedDBStoresNames): Promise<T[]> => {
		await waitForReady()
		const store = getStore(storeName)
		return wrapRequest(store.getAll())
	}

	const deleteItem = async (storeName: IndexedDBStoresNames, key: IDBValidKey): Promise<void> => {
		await waitForReady()
		const store = getStore(storeName, 'readwrite')
		return wrapRequest(store.delete(key))
	}

	const deleteMany = async (storeName: IndexedDBStoresNames, keys: IDBValidKey[]): Promise<void> => {
		if (keys.length === 0) return Promise.resolve()

		await waitForReady()
		const store = getStore(storeName, 'readwrite')
		await Promise.all(keys.map((key) => wrapRequest(store.delete(key))))
		return undefined
	}

	return {
		db: { add, put, upsert, getItem, getAll, deleteItem, deleteMany },
		isDatabaseReady,
	}
}
