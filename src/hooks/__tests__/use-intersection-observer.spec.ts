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
})
