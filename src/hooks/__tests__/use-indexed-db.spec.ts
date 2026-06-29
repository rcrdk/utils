import 'fake-indexeddb/auto'

import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useIndexedDB } from '@/hooks/use-indexed-db'

const renderReadyIndexedDB = async () => {
	const hook = renderHook(() => useIndexedDB())

	await waitFor(() => {
		expect(hook.result.current.isDatabaseReady).toBe(true)
	})

	return hook
}

describe('useIndexedDB', () => {
	it('should expose "isDatabaseReady" as false before the database opens', () => {
		const { result } = renderHook(() => useIndexedDB())

		expect(result.current.isDatabaseReady).toBe(false)
	})

	it('should open the database and expose CRUD helpers', async () => {
		const { result, unmount } = await renderReadyIndexedDB()

		const key = await result.current.db.add('chat-messages', { text: 'Hello' })

		const item = await result.current.db.getItem<{ text: string }>('chat-messages', key!)

		expect(item?.text).toBe('Hello')

		unmount()
	})

	it('should upsert existing records', async () => {
		const { result, unmount } = await renderReadyIndexedDB()

		const key = await result.current.db.upsert('chat-messages', { text: 'Draft' })
		await result.current.db.upsert('chat-messages', { id: key, text: 'Updated' })

		const item = await result.current.db.getItem<{ text: string }>('chat-messages', key!)

		expect(item?.text).toBe('Updated')

		unmount()
	})

	it('should put records by key', async () => {
		const { result, unmount } = await renderReadyIndexedDB()

		const key = await result.current.db.add('chat-messages', { text: 'Original' })
		await result.current.db.put('chat-messages', { id: key, text: 'Replaced' })

		const item = await result.current.db.getItem<{ text: string }>('chat-messages', key!)

		expect(item?.text).toBe('Replaced')

		unmount()
	})

	it('should return all items from a store', async () => {
		const { result, unmount } = await renderReadyIndexedDB()

		await result.current.db.add('chat-messages', { text: 'getAll-first' })
		await result.current.db.add('chat-messages', { text: 'getAll-second' })

		const items = await result.current.db.getAll<{ text: string }>('chat-messages')
		const addedItems = items.filter((item) => item.text.startsWith('getAll-'))

		expect(addedItems).toHaveLength(2)
		expect(addedItems.map((item) => item.text)).toEqual(['getAll-first', 'getAll-second'])

		unmount()
	})

	it('should delete items by key', async () => {
		const { result, unmount } = await renderReadyIndexedDB()

		const key = await result.current.db.add('chat-messages', { text: 'Remove me' })

		await result.current.db.deleteItem('chat-messages', key!)

		const item = await result.current.db.getItem('chat-messages', key!)

		expect(item).toBeUndefined()

		unmount()
	})

	it('should delete multiple items by key', async () => {
		const { result, unmount } = await renderReadyIndexedDB()

		const firstKey = await result.current.db.add('chat-messages', { text: 'deleteMany-first' })
		const secondKey = await result.current.db.add('chat-messages', { text: 'deleteMany-second' })

		await result.current.db.deleteMany('chat-messages', [firstKey!, secondKey!])

		const firstItem = await result.current.db.getItem('chat-messages', firstKey!)
		const secondItem = await result.current.db.getItem('chat-messages', secondKey!)

		expect(firstItem).toBeUndefined()
		expect(secondItem).toBeUndefined()

		unmount()
	})

	it('should resolve "deleteMany" immediately when keys is empty', async () => {
		const { result, unmount } = await renderReadyIndexedDB()

		await expect(result.current.db.deleteMany('chat-messages', [])).resolves.toBeUndefined()

		unmount()
	})
})
