import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

const COPY_TEXT = 'hello'
const COPIED_MESSAGE_TIMEOUT = 2000

describe('UseCopyToClipboard', () => {
	const writeText = vi.fn()
	const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

	const renderCopyHook = () => renderHook(() => useCopyToClipboard())

	const copyText = async (result: ReturnType<typeof renderCopyHook>['result'], text: string | null | undefined) => {
		await act(async () => {
			await result.current.onCopyToClipboard(text)
		})
	}

	beforeEach(() => {
		vi.useFakeTimers()
		writeText.mockReset()
		writeText.mockResolvedValue(undefined)
		consoleError.mockClear()
		Object.assign(navigator, {
			clipboard: { writeText },
		})
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('should initialize with "copiedToClipboard" as false', () => {
		const { result } = renderCopyHook()

		expect(result.current.copiedToClipboard).toBe(false)
	})

	it('should copy text and set "copiedToClipboard" to true', async () => {
		const { result } = renderCopyHook()

		await copyText(result, COPY_TEXT)

		expect(writeText).toHaveBeenCalledWith(COPY_TEXT)
		expect(result.current.copiedToClipboard).toBe(true)
	})

	it('should reset "copiedToClipboard" to false after the timeout', async () => {
		const { result } = renderCopyHook()

		await copyText(result, COPY_TEXT)

		act(() => {
			vi.advanceTimersByTime(COPIED_MESSAGE_TIMEOUT)
		})

		expect(result.current.copiedToClipboard).toBe(false)
	})

	it.each([
		['empty string', ''],
		['null', null],
		['undefined', undefined],
	] as const)('should not copy when text is %s', async (_label, text) => {
		const { result } = renderCopyHook()

		await copyText(result, text)

		expect(writeText).not.toHaveBeenCalled()
		expect(result.current.copiedToClipboard).toBe(false)
	})

	it('should not copy when "clipboard" is unavailable', async () => {
		Object.assign(navigator, { clipboard: undefined })

		const { result } = renderCopyHook()

		await copyText(result, COPY_TEXT)

		expect(writeText).not.toHaveBeenCalled()
		expect(result.current.copiedToClipboard).toBe(false)
	})

	it('should report an error and keep "copiedToClipboard" as false when copy fails', async () => {
		const copyError = new Error('clipboard denied')
		writeText.mockRejectedValue(copyError)

		const { result } = renderCopyHook()

		await copyText(result, COPY_TEXT)

		expect(consoleError).toHaveBeenCalledWith('Failed to copy text:', copyError)
		expect(result.current.copiedToClipboard).toBe(false)
	})
})
