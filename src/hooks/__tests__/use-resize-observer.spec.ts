import type { RefObject } from 'react'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useResizeObserver } from '@/hooks/use-resize-observer'

type MockResizeObserverInstance = {
	observe: ReturnType<typeof vi.fn>
	disconnect: ReturnType<typeof vi.fn>
	trigger: (width: number, height: number) => void
}

const createElementRef = (): RefObject<Element> => {
	const element = document.createElement('div')

	return { current: element }
}

describe('UseResizeObserver', () => {
	let observerInstances: MockResizeObserverInstance[] = []

	beforeEach(() => {
		observerInstances = []

		class MockResizeObserver {
			observe = vi.fn()
			disconnect = vi.fn()
			callback: ResizeObserverCallback

			constructor(callback: ResizeObserverCallback) {
				this.callback = callback

				const instance: MockResizeObserverInstance = {
					observe: this.observe,
					disconnect: this.disconnect,
					trigger: (width: number, height: number) => {
						this.callback(
							[{ contentRect: { width, height } } as ResizeObserverEntry],
							this as unknown as ResizeObserver,
						)
					},
				}

				observerInstances.push(instance)
			}
		}

		vi.stubGlobal('ResizeObserver', MockResizeObserver)
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	const defaultParams = {
		ref: createElementRef(),
	}

	it('should initialize with null "entry", "width", and "height"', () => {
		const { result } = renderHook(() => useResizeObserver(defaultParams))

		expect(result.current.entry).toBeNull()
		expect(result.current.width).toBeNull()
		expect(result.current.height).toBeNull()
	})

	it('should observe the ref element when "enabled" is true', () => {
		renderHook(() => useResizeObserver(defaultParams))

		const observerInstance = observerInstances.at(0)

		expect(observerInstance?.observe).toHaveBeenCalledWith(defaultParams.ref.current, { box: 'content-box' })
	})

	it('should not observe when "enabled" is false', () => {
		renderHook(() => useResizeObserver({ ...defaultParams, enabled: false }))

		expect(observerInstances).toHaveLength(0)
	})

	it('should set "width" and "height" when the observer callback fires', () => {
		const { result } = renderHook(() => useResizeObserver(defaultParams))

		const observerInstance = observerInstances.at(0)

		act(() => {
			observerInstance?.trigger(320, 240)
		})

		expect(result.current.width).toBe(320)
		expect(result.current.height).toBe(240)
	})

	it('should disconnect the observer on unmount', () => {
		const { unmount } = renderHook(() => useResizeObserver(defaultParams))

		const observerInstance = observerInstances.at(0)

		unmount()

		expect(observerInstance?.disconnect).toHaveBeenCalledTimes(1)
	})
})
