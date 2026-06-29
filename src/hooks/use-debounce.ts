import { useEffect, useState } from 'react'

export const useDebounce = <T>(value: T, delay: number): T => {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)
	const skipDebounce = delay <= 0

	useEffect(() => {
		if (skipDebounce) return

		const handler = setTimeout(() => setDebouncedValue(value), delay)

		return () => clearTimeout(handler)
	}, [value, delay, skipDebounce])

	if (skipDebounce) return value

	return debouncedValue
}
