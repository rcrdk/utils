import { useCallback, useRef, useState } from 'react'

type Coordinates = {
	lat: string
	lng: string
}

// TODO: Add error reporting to a bug tracking system
const reportError = (error: unknown) => {
	console.error('Failed to retrieve location:', error)
}

export const useGeolocation = () => {
	const [location, setLocation] = useState<Coordinates | null>(null)
	const [isRequestingLocation, setIsRequestingLocation] = useState(false)
	const hasRequestedRef = useRef(false)

	const onRequestLocation = useCallback(() => {
		const isSupported = typeof window !== 'undefined' && 'geolocation' in navigator

		if (!isSupported) {
			reportError('Geolocation is not supported')
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
				reportError(geoError?.message ?? 'Failed to retrieve location')
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
