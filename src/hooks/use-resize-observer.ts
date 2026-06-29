import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

type UseResizeObserverParams = {
	ref: RefObject<Element | null>
	enabled?: boolean
	box?: ResizeObserverBoxOptions
}

const isResizeObserverSupported = () => typeof window !== 'undefined' && 'ResizeObserver' in window

export const useResizeObserver = ({ ref, enabled = true, box = 'content-box' }: UseResizeObserverParams) => {
	const [entry, setEntry] = useState<ResizeObserverEntry | null>(null)

	useEffect(() => {
		const element = ref.current

		if (!enabled || !element || !isResizeObserverSupported()) return

		const observer = new ResizeObserver((entries) => {
			const observerEntry = entries.at(0)
			if (!observerEntry) return

			setEntry(observerEntry)
		})

		observer.observe(element, { box })

		return () => observer.disconnect()
	}, [ref, enabled, box])

	const width = entry?.contentRect.width ?? null
	const height = entry?.contentRect.height ?? null

	return { entry, width, height }
}
