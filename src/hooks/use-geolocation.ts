import { useCallback, useRef, useState } from 'react'

import { reportError } from '@/lib/sentry/report-error'

type Coordinates = {
	lat: string
	lng: string
}

export const useGeolocation = () => {
	const [location, setLocation] = useState<Coordinates | null>(null)
	const [isRequestingLocation, setIsRequestingLocation] = useState(false)
	const hasRequestedRef = useRef(false)

	const onRequestLocation = useCallback(() => {
		const isSupported = typeof window !== 'undefined' && 'geolocation' in navigator

		if (!isSupported) {
			reportError({ error: 'Geolocation is not supported', message: 'Failed to retrieve location' })
			return
		}

		if (hasRequestedRef.current) return
		hasRequestedRef.current = true

		setIsRequestingLocation(true)

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords
				setLocation({ lat: String(latitude), lng: String(longitude) })
				setIsRequestingLocation(false)
			},
			(geoError) => {
				reportError({
					error: geoError?.message ?? 'Failed to retrieve location',
					message: 'Failed to retrieve location',
				})
				setIsRequestingLocation(false)
			},
		)
	}, [])

	return {
		location,
		isRequestingLocation,
		onRequestLocation,
	}
}
