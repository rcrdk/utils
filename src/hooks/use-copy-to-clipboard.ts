import { useCallback, useEffect, useRef, useState } from 'react'

const COPIED_MESSAGE_TIMEOUT = 2000

// TODO: Add error reporting to a bug tracking system
const reportError = (error: unknown) => {
	console.error('Failed to copy text:', error)
}

export const useCopyToClipboard = () => {
	const [copiedToClipboard, setCopiedToClipboard] = useState(false)
	const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const onCopyToClipboard = useCallback(async (text: string | null | undefined) => {
		if (!text || !navigator?.clipboard) return

		try {
			await navigator.clipboard.writeText(text)
			setCopiedToClipboard(true)

			if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current)

			copiedTimeoutRef.current = setTimeout(() => {
				setCopiedToClipboard(false)
				copiedTimeoutRef.current = null
			}, COPIED_MESSAGE_TIMEOUT)
		} catch (error) {
			reportError(error)
		}
	}, [])

	useEffect(
		() => () => {
			if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current)
		},
		[],
	)

	return { onCopyToClipboard, copiedToClipboard }
}
