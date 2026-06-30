import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebounce } from '@/hooks/use-debounce'

const DEBOUNCE_DELAY = 500

describe('UseDebounce', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should return the initial value immediately', () => {
		const { result } = renderHook(() => useDebounce('initial', DEBOUNCE_DELAY))

		expect(result.current).toBe('initial')
	})

	it('should return the debounced value after the delay', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'a', delay: DEBOUNCE_DELAY },
		})

		expect(result.current).toBe('a')

		rerender({ value: 'b', delay: DEBOUNCE_DELAY })

		expect(result.current).toBe('a')

		act(() => {
			vi.advanceTimersByTime(DEBOUNCE_DELAY)
		})

		expect(result.current).toBe('b')
	})

	it('should keep only the latest value when updates happen within the delay', () => {
		const { result, rerender } = renderHook(({ value }) => useDebounce(value, DEBOUNCE_DELAY), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'b' })
		rerender({ value: 'c' })

		act(() => {
			vi.advanceTimersByTime(DEBOUNCE_DELAY)
		})

		expect(result.current).toBe('c')
	})

	it('should restart the delay when the delay option changes', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'a', delay: DEBOUNCE_DELAY },
		})

		rerender({ value: 'b', delay: DEBOUNCE_DELAY })

		act(() => {
			vi.advanceTimersByTime(200)
		})

		rerender({ value: 'b', delay: 1000 })

		act(() => {
			vi.advanceTimersByTime(DEBOUNCE_DELAY)
		})

		expect(result.current).toBe('a')

		act(() => {
			vi.advanceTimersByTime(500)
		})

		expect(result.current).toBe('b')
	})

	it.each([
		['zero delay', 0],
		['negative delay', -100],
	] as const)('should return the value immediately when delay is %s', (_label, delay) => {
		const { result, rerender } = renderHook(({ value }) => useDebounce(value, delay), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'b' })

		expect(result.current).toBe('b')
	})

	it('should reset the timer when value changes before the delay elapses', () => {
		const { result, rerender } = renderHook(({ value }) => useDebounce(value, DEBOUNCE_DELAY), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'b' })

		act(() => {
			vi.advanceTimersByTime(400)
		})

		expect(result.current).toBe('a')

		rerender({ value: 'c' })

		act(() => {
			vi.advanceTimersByTime(400)
		})

		expect(result.current).toBe('a')

		act(() => {
			vi.advanceTimersByTime(100)
		})

		expect(result.current).toBe('c')
	})

	it('should not update after unmount when the delay elapses', () => {
		const { result, rerender, unmount } = renderHook(({ value }) => useDebounce(value, DEBOUNCE_DELAY), {
			initialProps: { value: 'a' },
		})

		rerender({ value: 'b' })
		unmount()

		act(() => {
			vi.advanceTimersByTime(DEBOUNCE_DELAY)
		})

		expect(result.current).toBe('a')
	})

	it.each<[string, { id: number } | number[] | number, { id: number } | number[] | number]>([
		['objects by reference', { id: 1 }, { id: 2 }],
		['arrays', [1, 2], [3, 4]],
		['numbers', 10, 20],
	])('should debounce %s', (_label, initialValue, nextValue) => {
		const { result, rerender } = renderHook(({ value }) => useDebounce(value, DEBOUNCE_DELAY), {
			initialProps: { value: initialValue },
		})

		rerender({ value: nextValue })

		expect(result.current).toEqual(initialValue)

		act(() => {
			vi.advanceTimersByTime(DEBOUNCE_DELAY)
		})

		expect(result.current).toEqual(nextValue)
	})
})
