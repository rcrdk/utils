import { useCallback, useEffect, useRef, useState } from 'react'

import { reportError } from '@/lib/sentry/report-error'

const COPIED_MESSAGE_TIMEOUT = 2000

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
			reportError({ error, message: 'Failed to copy text to clipboard' })
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
