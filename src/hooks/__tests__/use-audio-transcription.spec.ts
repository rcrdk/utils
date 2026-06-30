import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AUDIO_TRANSCRIPTION_ERROR_MESSAGES } from '@/constants/ui/audio-recorder'
import { useAudioTranscription } from '@/hooks/use-audio-transcription'

const AUDIO_BLOB = new Blob(['audio'], { type: 'audio/webm' })
const TRANSCRIBED_TEXT = 'hello world'

const defaultOptions = {
	transcribeAction: vi.fn().mockResolvedValue({ text: TRANSCRIBED_TEXT }),
	onSuccess: vi.fn(),
	onError: vi.fn(),
	onStart: vi.fn(),
	onFinish: vi.fn(),
}

const renderTranscriptionHook = (options: Partial<typeof defaultOptions> = {}) =>
	renderHook(() =>
		useAudioTranscription({
			...defaultOptions,
			...options,
		}),
	)

const transcribeBlob = async (result: ReturnType<typeof renderTranscriptionHook>['result']) => {
	let transcribedText = ''

	await act(async () => {
		transcribedText = await result.current.transcribe(AUDIO_BLOB)
	})

	return transcribedText
}

describe('UseAudioTranscription', () => {
	it('should initialize with "isTranscribing" as false', () => {
		const { result } = renderTranscriptionHook()

		expect(result.current.isTranscribing).toBe(false)
	})

	it('should return transcribed text and call lifecycle callbacks on success', async () => {
		const transcribeAction = vi.fn().mockResolvedValue({ text: TRANSCRIBED_TEXT })
		const onSuccess = vi.fn()
		const onStart = vi.fn()
		const onFinish = vi.fn()

		const { result } = renderTranscriptionHook({ transcribeAction, onSuccess, onStart, onFinish })

		const transcribedText = await transcribeBlob(result)

		expect(transcribedText).toBe(TRANSCRIBED_TEXT)
		expect(transcribeAction).toHaveBeenCalledWith(AUDIO_BLOB)
		expect(onStart).toHaveBeenCalledTimes(1)
		expect(onSuccess).toHaveBeenCalledWith(TRANSCRIBED_TEXT)
		expect(onFinish).toHaveBeenCalledTimes(1)
		expect(result.current.isTranscribing).toBe(false)
	})

	it('should call "onError" and throw when "transcribeAction" returns a string error', async () => {
		const errorMessage = 'Transcription failed'
		const transcribeAction = vi.fn().mockResolvedValue(errorMessage)
		const onError = vi.fn()

		const { result } = renderTranscriptionHook({ transcribeAction, onError })

		await expect(transcribeBlob(result)).rejects.toThrow(errorMessage)

		expect(onError).toHaveBeenCalledWith(errorMessage)
	})

	it('should call "onError" with "AUDIO_TRANSCRIPTION_ERROR_MESSAGES.EMPTY" when text is missing', async () => {
		const transcribeAction = vi.fn().mockResolvedValue({ text: '' })
		const onError = vi.fn()

		const { result } = renderTranscriptionHook({ transcribeAction, onError })

		await expect(transcribeBlob(result)).rejects.toThrow(AUDIO_TRANSCRIPTION_ERROR_MESSAGES.EMPTY)

		expect(onError).toHaveBeenCalledWith(AUDIO_TRANSCRIPTION_ERROR_MESSAGES.EMPTY)
	})

	it('should call "onError" with "AUDIO_TRANSCRIPTION_ERROR_MESSAGES.UNEXPECTED" when "transcribeAction" throws a non-Error value', async () => {
		const transcribeAction = vi.fn().mockRejectedValue('network failure')
		const onError = vi.fn()

		const { result } = renderTranscriptionHook({ transcribeAction, onError })

		await expect(transcribeBlob(result)).rejects.toBe('network failure')

		expect(onError).toHaveBeenCalledWith(AUDIO_TRANSCRIPTION_ERROR_MESSAGES.UNEXPECTED)
	})
})
