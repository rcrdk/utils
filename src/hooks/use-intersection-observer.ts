import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

type UseIntersectionObserverParams = {
	ref: RefObject<Element | null>
	enabled?: boolean
	root?: Element | Document | null
	rootMargin?: string
	threshold?: number | number[]
}

const isIntersectionObserverSupported = () => typeof window !== 'undefined' && 'IntersectionObserver' in window

export const useIntersectionObserver = ({
	ref,
	enabled = true,
	root = null,
	rootMargin = '0px',
	threshold = 0,
}: UseIntersectionObserverParams) => {
	const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

	useEffect(() => {
		const element = ref.current

		if (!enabled || !element || !isIntersectionObserverSupported()) return

		const observer = new IntersectionObserver(
			(entries) => {
				const observerEntry = entries.at(0)
				if (!observerEntry) return

				setEntry(observerEntry)
			},
			{ root, rootMargin, threshold },
		)

		observer.observe(element)

		return () => observer.disconnect()
	}, [ref, enabled, root, rootMargin, threshold])

	const isIntersecting = entry?.isIntersecting ?? false

	return { entry, isIntersecting }
}
