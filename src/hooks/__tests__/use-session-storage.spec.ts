import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { useSessionStorage } from '@/hooks/use-session-storage'

const SESSION_STORAGE_KEY = 'test-session-storage-key'

const testSchema = z.object({
	query: z.string(),
	page: z.number(),
})

type TestSchema = z.infer<typeof testSchema>

const TEST_VALUE: TestSchema = { query: 'apartments', page: 2 }

describe('UseSessionStorage', () => {
	const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

	const renderSessionStorageHook = () =>
		renderHook(() => useSessionStorage({ sessionStorageKey: SESSION_STORAGE_KEY, schema: testSchema }))

	beforeEach(() => {
		sessionStorage.clear()
		consoleError.mockClear()
	})

	afterEach(() => {
		sessionStorage.clear()
	})

	it('should return null when no value is stored', () => {
		const { result } = renderSessionStorageHook()

		expect(result.current.getSessionValue()).toBeNull()
	})

	it('should save and retrieve a validated value', () => {
		const { result } = renderSessionStorageHook()

		act(() => {
			result.current.saveSessionValue(TEST_VALUE)
		})

		expect(result.current.getSessionValue()).toEqual(TEST_VALUE)
		expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).toBe(JSON.stringify(TEST_VALUE))
	})

	it('should return null when stored data fails schema validation', () => {
		sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ query: 'apartments', page: 'invalid' }))

		const { result } = renderSessionStorageHook()

		expect(result.current.getSessionValue()).toBeNull()
	})

	it('should return null and report an error when stored data is not valid JSON', () => {
		sessionStorage.setItem(SESSION_STORAGE_KEY, 'not-json{')

		const { result } = renderSessionStorageHook()

		expect(result.current.getSessionValue()).toBeNull()
		expect(consoleError).toHaveBeenCalledWith(
			`Session storage get failed for key "${SESSION_STORAGE_KEY}":`,
			expect.any(SyntaxError),
		)
	})

	it('should clear a stored value', () => {
		const { result } = renderSessionStorageHook()

		act(() => {
			result.current.saveSessionValue(TEST_VALUE)
		})

		act(() => {
			result.current.clearSessionValue()
		})

		expect(result.current.getSessionValue()).toBeNull()
		expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()
	})

	it('should report an error when saving fails', () => {
		const saveError = new Error('quota exceeded')
		const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw saveError
		})

		const { result } = renderSessionStorageHook()

		act(() => {
			result.current.saveSessionValue(TEST_VALUE)
		})

		expect(consoleError).toHaveBeenCalledWith(
			`Session storage save failed for key "${SESSION_STORAGE_KEY}":`,
			saveError,
		)

		setItem.mockRestore()
	})

	it('should report an error when clearing fails', () => {
		const clearError = new Error('storage unavailable')
		const removeItem = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
			throw clearError
		})

		const { result } = renderSessionStorageHook()

		act(() => {
			result.current.clearSessionValue()
		})

		expect(consoleError).toHaveBeenCalledWith(
			`Session storage clear failed for key "${SESSION_STORAGE_KEY}":`,
			clearError,
		)

		removeItem.mockRestore()
	})

	it('should use the latest session storage key after rerender', () => {
		const firstKey = 'first-key'
		const secondKey = 'second-key'

		const { result, rerender } = renderHook(
			({ sessionStorageKey }) => useSessionStorage({ sessionStorageKey, schema: testSchema }),
			{ initialProps: { sessionStorageKey: firstKey } },
		)

		act(() => {
			result.current.saveSessionValue(TEST_VALUE)
		})

		rerender({ sessionStorageKey: secondKey })

		expect(result.current.getSessionValue()).toBeNull()

		act(() => {
			result.current.saveSessionValue({ ...TEST_VALUE, page: 3 })
		})

		expect(result.current.getSessionValue()).toEqual({ ...TEST_VALUE, page: 3 })
		expect(sessionStorage.getItem(firstKey)).toBe(JSON.stringify(TEST_VALUE))
		expect(sessionStorage.getItem(secondKey)).toBe(JSON.stringify({ ...TEST_VALUE, page: 3 }))
	})
})
