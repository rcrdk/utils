import { useEffect } from 'react'

type UseEscapeKeyOptions = {
	enabled: boolean
	onEscape: VoidFunction
}

export const useEscapeKey = ({ enabled, onEscape }: Readonly<UseEscapeKeyOptions>) => {
	useEffect(() => {
		if (!enabled || typeof window === 'undefined') return

		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') onEscape()
		}

		window.addEventListener('keydown', handleEscapeKey)
		return () => window.removeEventListener('keydown', handleEscapeKey)
	}, [enabled, onEscape])
}
