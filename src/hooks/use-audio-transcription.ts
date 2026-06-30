'use client'

import { useCallback, useState } from 'react'

import { AUDIO_TRANSCRIPTION_ERROR_MESSAGES } from '@/constants/ui/audio-recorder'

export type TranscribeAction = (blob: Blob) => Promise<{ text?: string } | string>

interface UseAudioTranscriptionOptions {
	transcribeAction: TranscribeAction
	onSuccess?: (text: string) => void
	onError?: (error: string) => void
	onStart?: VoidFunction
	onFinish?: VoidFunction
}

export const useAudioTranscription = ({
	transcribeAction,
	onSuccess,
	onError,
	onStart,
	onFinish,
}: UseAudioTranscriptionOptions) => {
	const [isTranscribing, setIsTranscribing] = useState(false)

	const transcribe = useCallback(
		async (blob: Blob): Promise<string> => {
			setIsTranscribing(true)
			onStart?.()

			try {
				const result = await transcribeAction(blob)

				if (typeof result === 'string') {
					onError?.(result)
					throw new Error(result)
				}

				const transcribedText = result?.text
				if (!transcribedText) {
					const error = AUDIO_TRANSCRIPTION_ERROR_MESSAGES.EMPTY
					onError?.(error)
					throw new Error(error)
				}

				onSuccess?.(transcribedText)
				return transcribedText
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : AUDIO_TRANSCRIPTION_ERROR_MESSAGES.UNEXPECTED
				onError?.(errorMessage)
				throw error
			} finally {
				setIsTranscribing(false)
				onFinish?.()
			}
		},
		[onError, onFinish, onStart, onSuccess, transcribeAction],
	)

	return {
		transcribe,
		isTranscribing,
	}
}
