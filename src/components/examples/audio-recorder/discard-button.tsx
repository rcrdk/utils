import { cn } from '@/utils/ui/tw'

interface Props {
	isRecording: boolean
	onDiscard: VoidFunction
	className?: string
}

export function DiscardButton({ isRecording, onDiscard, className }: Readonly<Props>) {
	if (!isRecording) return null

	return (
		<button type="button" className={cn(className)} aria-label="Cancelar gravação" onClick={onDiscard}>
			🗑️
		</button>
	)
}
