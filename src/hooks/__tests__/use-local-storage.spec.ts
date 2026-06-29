import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { useLocalStorage } from '@/hooks/use-local-storage'

const LOCAL_STORAGE_KEY = 'test-local-storage-key'

const testSchema = z.object({
	query: z.string(),
	page: z.number(),
})

type TestSchema = z.infer<typeof testSchema>

const TEST_VALUE: TestSchema = { query: 'apartments', page: 2 }

describe('UseLocalStorage', () => {
	const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

	const renderLocalStorageHook = () =>
		renderHook(() => useLocalStorage({ localStorageKey: LOCAL_STORAGE_KEY, schema: testSchema }))

	beforeEach(() => {
		localStorage.clear()
		consoleError.mockClear()
	})

	afterEach(() => {
		localStorage.clear()
	})

	it('should return null when no value is stored', () => {
		const { result } = renderLocalStorageHook()

		expect(result.current.getLocalValue()).toBeNull()
	})

	it('should save and retrieve a validated value', () => {
		const { result } = renderLocalStorageHook()

		act(() => {
			result.current.saveLocalValue(TEST_VALUE)
		})

		expect(result.current.getLocalValue()).toEqual(TEST_VALUE)
		expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBe(JSON.stringify(TEST_VALUE))
	})

	it('should return null when stored data fails schema validation', () => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ query: 'apartments', page: 'invalid' }))

		const { result } = renderLocalStorageHook()

		expect(result.current.getLocalValue()).toBeNull()
	})

	it('should return null and report an error when stored data is not valid JSON', () => {
		localStorage.setItem(LOCAL_STORAGE_KEY, 'not-json{')

		const { result } = renderLocalStorageHook()

		expect(result.current.getLocalValue()).toBeNull()
		expect(consoleError).toHaveBeenCalledWith(
			`Local storage get failed for key "${LOCAL_STORAGE_KEY}":`,
			expect.any(SyntaxError),
		)
	})

	it('should clear a stored value', () => {
		const { result } = renderLocalStorageHook()

		act(() => {
			result.current.saveLocalValue(TEST_VALUE)
		})

		act(() => {
			result.current.clearLocalValue()
		})

		expect(result.current.getLocalValue()).toBeNull()
		expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBeNull()
	})

	it('should report an error when saving fails', () => {
		const saveError = new Error('quota exceeded')
		const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw saveError
		})

		const { result } = renderLocalStorageHook()

		act(() => {
			result.current.saveLocalValue(TEST_VALUE)
		})

		expect(consoleError).toHaveBeenCalledWith(`Local storage save failed for key "${LOCAL_STORAGE_KEY}":`, saveError)

		setItem.mockRestore()
	})

	it('should report an error when clearing fails', () => {
		const clearError = new Error('storage unavailable')
		const removeItem = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
			throw clearError
		})

		const { result } = renderLocalStorageHook()

		act(() => {
			result.current.clearLocalValue()
		})

		expect(consoleError).toHaveBeenCalledWith(`Local storage clear failed for key "${LOCAL_STORAGE_KEY}":`, clearError)

		removeItem.mockRestore()
	})

	it('should use the latest local storage key after rerender', () => {
		const firstKey = 'first-key'
		const secondKey = 'second-key'

		const { result, rerender } = renderHook(
			({ localStorageKey }) => useLocalStorage({ localStorageKey, schema: testSchema }),
			{ initialProps: { localStorageKey: firstKey } },
		)

		act(() => {
			result.current.saveLocalValue(TEST_VALUE)
		})

		rerender({ localStorageKey: secondKey })

		expect(result.current.getLocalValue()).toBeNull()

		act(() => {
			result.current.saveLocalValue({ ...TEST_VALUE, page: 3 })
		})

		expect(result.current.getLocalValue()).toEqual({ ...TEST_VALUE, page: 3 })
		expect(localStorage.getItem(firstKey)).toBe(JSON.stringify(TEST_VALUE))
		expect(localStorage.getItem(secondKey)).toBe(JSON.stringify({ ...TEST_VALUE, page: 3 }))
	})
})
