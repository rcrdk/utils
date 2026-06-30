'use client'

import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { useAudioTranscription, type TranscribeAction } from '@/hooks/use-audio-transcription'
import { useEscapeKey } from '@/hooks/use-escape-key'
import type { ClassesByKeys } from '@/types/shared'
import { cn } from '@/utils/ui/tw'
import { DiscardButton } from './discard-button'
import { AudioRecorderButtonIcons } from './icons'

interface AudioRecorderProps {
	transcribeAction: TranscribeAction
	onTranscription: (text: string) => void
	onError?: (error: string) => void
	onStartRecording?: VoidFunction
	onStopRecording?: VoidFunction
	onTranscriptStart?: VoidFunction
	onTranscriptFinish?: VoidFunction
	disabled?: boolean
	classes?: ClassesByKeys<'root' | 'button' | 'icons' | 'discardButton' | 'recordingVisualizer'>
	onSubmit?: VoidFunction
}

export function AudioRecorder({
	transcribeAction,
	onTranscription,
	onError,
	onStartRecording,
	onStopRecording,
	onTranscriptStart,
	onTranscriptFinish,
	disabled = false,
	classes,
	onSubmit,
}: Readonly<AudioRecorderProps>) {
	const { transcribe, isTranscribing } = useAudioTranscription({
		transcribeAction,
		onStart: onTranscriptStart,
		onSuccess: (text: string) => onTranscription(text),
		onError: (error: string) => onError?.(error),
		onFinish: onTranscriptFinish,
	})

	const { isRecording, recordButtonLabel, recordButtonRef, onDiscardRecording, onRecordButtonClick } = useAudioRecorder(
		{
			isTranscribing,
			onTranscription: transcribe,
			onError: (error: string) => onError?.(error),
			onStartRecording,
			onStopRecording,
		},
	)

	useEscapeKey({
		enabled: isRecording,
		onEscape: onDiscardRecording,
	})

	const handleButtonClick = onSubmit ? onSubmit : onRecordButtonClick

	const isDisabled = disabled || isTranscribing

	return (
		<div data-testid="audio-recorder" className={cn(classes?.root)}>
			<DiscardButton isRecording={isRecording} onDiscard={onDiscardRecording} className={cn(classes?.discardButton)} />

			<button
				type="button"
				onClick={handleButtonClick}
				ref={recordButtonRef}
				disabled={isDisabled}
				data-testid="audio-recorder-button"
				aria-label={recordButtonLabel}
				className={cn(classes?.button)}
			>
				<AudioRecorderButtonIcons
					isTranscribing={isTranscribing}
					isRecording={isRecording}
					className={cn(classes?.icons)}
				/>
			</button>
		</div>
	)
}
