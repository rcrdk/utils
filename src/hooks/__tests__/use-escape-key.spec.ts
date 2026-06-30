import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useEscapeKey } from '@/hooks/use-escape-key'

const defaultOptions = {
	enabled: true,
	onEscape: vi.fn(),
}

const renderEscapeKeyHook = (options: Partial<typeof defaultOptions> = {}) =>
	renderHook(() =>
		useEscapeKey({
			...defaultOptions,
			...options,
		}),
	)

const pressKey = (key: string) => {
	act(() => {
		window.dispatchEvent(new KeyboardEvent('keydown', { key }))
	})
}

describe('UseEscapeKey', () => {
	afterEach(() => {
		vi.clearAllMocks()
	})

	it('should call "onEscape" when Escape is pressed and "enabled" is true', () => {
		const onEscape = vi.fn()

		renderEscapeKeyHook({ onEscape })

		pressKey('Escape')

		expect(onEscape).toHaveBeenCalledTimes(1)
	})

	it('should not call "onEscape" when "enabled" is false', () => {
		const onEscape = vi.fn()

		renderEscapeKeyHook({ enabled: false, onEscape })

		pressKey('Escape')

		expect(onEscape).not.toHaveBeenCalled()
	})

	it('should not call "onEscape" for non-Escape keys', () => {
		const onEscape = vi.fn()

		renderEscapeKeyHook({ onEscape })

		pressKey('Enter')

		expect(onEscape).not.toHaveBeenCalled()
	})

	it('should stop calling "onEscape" after unmount', () => {
		const onEscape = vi.fn()

		const { unmount } = renderEscapeKeyHook({ onEscape })

		unmount()
		pressKey('Escape')

		expect(onEscape).not.toHaveBeenCalled()
	})

	it('should stop calling "onEscape" when "enabled" changes to false', () => {
		const onEscape = vi.fn()

		const { rerender } = renderHook(({ enabled }) => useEscapeKey({ enabled, onEscape }), {
			initialProps: { enabled: true },
		})

		pressKey('Escape')
		expect(onEscape).toHaveBeenCalledTimes(1)

		rerender({ enabled: false })
		pressKey('Escape')

		expect(onEscape).toHaveBeenCalledTimes(1)
	})

	it('should call the latest "onEscape" callback', () => {
		const onEscape = vi.fn()
		const updatedOnEscape = vi.fn()

		const { rerender } = renderHook(({ callback }) => useEscapeKey({ enabled: true, onEscape: callback }), {
			initialProps: { callback: onEscape },
		})

		rerender({ callback: updatedOnEscape })
		pressKey('Escape')

		expect(onEscape).not.toHaveBeenCalled()
		expect(updatedOnEscape).toHaveBeenCalledTimes(1)
	})
})
