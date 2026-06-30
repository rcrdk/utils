import { cn } from '@/utils/ui/tw'

interface Props {
	isTranscribing: boolean
	isRecording: boolean
	className?: string
}

type IconState = 'transcribing' | 'recording' | 'record'

const iconComponents: Record<IconState, string> = {
	transcribing: '🔄',
	recording: '⏹',
	record: '🎤',
}

export function AudioRecorderButtonIcons({ isTranscribing, isRecording, className }: Readonly<Props>) {
	const getCurrentState = (): IconState => {
		if (isTranscribing) return 'transcribing'
		if (isRecording) return 'recording'
		return 'record'
	}

	const currentState = getCurrentState()
	const icon = iconComponents[currentState]

	return (
		<span data-testid={`audio-recorder-button-icon-${currentState}`} aria-hidden className={cn(className)}>
			{icon}
		</span>
	)
}
