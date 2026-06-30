import type { RefObject } from 'react'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

type MockIntersectionObserverInstance = {
	observe: ReturnType<typeof vi.fn>
	disconnect: ReturnType<typeof vi.fn>
	trigger: (isIntersecting: boolean) => void
}

const createElementRef = (): RefObject<Element> => {
	const element = document.createElement('div')

	return { current: element }
}

describe('UseIntersectionObserver', () => {
	let observerInstances: MockIntersectionObserverInstance[] = []

	beforeEach(() => {
		observerInstances = []

		class MockIntersectionObserver {
			observe = vi.fn()
			disconnect = vi.fn()
			callback: IntersectionObserverCallback

			constructor(callback: IntersectionObserverCallback) {
				this.callback = callback

				const instance: MockIntersectionObserverInstance = {
					observe: this.observe,
					disconnect: this.disconnect,
					trigger: (isIntersecting: boolean) => {
						this.callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
					},
				}

				observerInstances.push(instance)
			}
		}

		vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	const defaultParams = {
		ref: createElementRef(),
	}

	it('should initialize with null "entry" and "isIntersecting" as false', () => {
		const { result } = renderHook(() => useIntersectionObserver(defaultParams))

		expect(result.current.entry).toBeNull()
		expect(result.current.isIntersecting).toBe(false)
	})

	it('should observe the ref element when "enabled" is true', () => {
		renderHook(() => useIntersectionObserver(defaultParams))

		const observerInstance = observerInstances.at(0)

		expect(observerInstance?.observe).toHaveBeenCalledWith(defaultParams.ref.current)
	})

	it('should not observe when "enabled" is false', () => {
		renderHook(() => useIntersectionObserver({ ...defaultParams, enabled: false }))

		expect(observerInstances).toHaveLength(0)
	})

	it('should set "isIntersecting" when the observer callback fires', () => {
		const { result } = renderHook(() => useIntersectionObserver(defaultParams))

		const observerInstance = observerInstances.at(0)

		act(() => {
			observerInstance?.trigger(true)
		})

		expect(result.current.isIntersecting).toBe(true)
		expect(result.current.entry?.isIntersecting).toBe(true)
	})

	it('should disconnect the observer on unmount', () => {
		const { unmount } = renderHook(() => useIntersectionObserver(defaultParams))

		const observerInstance = observerInstances.at(0)

		unmount()

		expect(observerInstance?.disconnect).toHaveBeenCalledTimes(1)
	})

	it('should pass observer options to IntersectionObserver', () => {
		const root = document.createElement('div')
		const rootMargin = '10px 0px'
		const threshold = 0.5

		let capturedOptions: IntersectionObserverInit | undefined

		class OptionsCapturingObserver {
			observe = vi.fn()
			disconnect = vi.fn()

			constructor(_callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
				capturedOptions = options
			}
		}

		vi.stubGlobal('IntersectionObserver', OptionsCapturingObserver)

		renderHook(() =>
			useIntersectionObserver({
				ref: createElementRef(),
				root,
				rootMargin,
				threshold,
			}),
		)

		expect(capturedOptions).toEqual({ root, rootMargin, threshold })
	})

	it('should set "isIntersecting" back to false when the element leaves the viewport', () => {
		const { result } = renderHook(() => useIntersectionObserver(defaultParams))

		const observerInstance = observerInstances.at(0)

		act(() => {
			observerInstance?.trigger(true)
		})

		expect(result.current.isIntersecting).toBe(true)

		act(() => {
			observerInstance?.trigger(false)
		})

		expect(result.current.isIntersecting).toBe(false)
	})

	it('should reconnect when "enabled" toggles from false to true', () => {
		const { rerender } = renderHook(({ enabled }) => useIntersectionObserver({ ...defaultParams, enabled }), {
			initialProps: { enabled: false },
		})

		expect(observerInstances).toHaveLength(0)

		rerender({ enabled: true })

		expect(observerInstances).toHaveLength(1)
		expect(observerInstances.at(0)?.observe).toHaveBeenCalledWith(defaultParams.ref.current)
	})

	it('should not observe when "ref.current" is null', () => {
		const ref: RefObject<Element | null> = { current: null }

		renderHook(() => useIntersectionObserver({ ref }))

		expect(observerInstances).toHaveLength(0)
	})

	it('should reconnect when the ref object changes to a different element', () => {
		const firstElement = document.createElement('div')
		const secondElement = document.createElement('div')

		const { rerender } = renderHook(({ ref }) => useIntersectionObserver({ ref }), {
			initialProps: { ref: { current: firstElement } as RefObject<Element> },
		})

		const firstObserver = observerInstances.at(0)

		rerender({ ref: { current: secondElement } as RefObject<Element> })

		expect(firstObserver?.disconnect).toHaveBeenCalledTimes(1)
		expect(observerInstances).toHaveLength(2)
		expect(observerInstances.at(1)?.observe).toHaveBeenCalledWith(secondElement)
	})
})
