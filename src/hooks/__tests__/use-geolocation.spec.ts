import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useGeolocation } from '@/hooks/use-geolocation'

const defaultCoords = { latitude: -23.5, longitude: -46.6 }

describe('UseGeolocation', () => {
	const getCurrentPosition = vi.fn()
	const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

	const mockGeolocationSuccess = (coords = defaultCoords) => {
		getCurrentPosition.mockImplementation((success: PositionCallback) => {
			success({ coords } as GeolocationPosition)
		})
	}

	const mockGeolocationError = (message = 'denied') => {
		getCurrentPosition.mockImplementation((_success, error: PositionErrorCallback) => {
			error?.({ message } as GeolocationPositionError)
		})
	}

	const renderGeolocationHook = () => renderHook(() => useGeolocation())

	const requestLocation = (result: ReturnType<typeof renderGeolocationHook>['result']) => {
		act(() => {
			result.current.onRequestLocation()
		})
	}

	beforeEach(() => {
		getCurrentPosition.mockReset()
		consoleError.mockClear()
		Object.assign(navigator, {
			geolocation: { getCurrentPosition },
		})
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it('should initialize with null "location" and "isRequestingLocation" as false', () => {
		const { result } = renderGeolocationHook()

		expect(result.current.location).toBeNull()
		expect(result.current.isRequestingLocation).toBe(false)
	})

	it('should set "location" when geolocation succeeds', async () => {
		mockGeolocationSuccess()

		const { result } = renderGeolocationHook()

		requestLocation(result)

		await waitFor(() => {
			expect(result.current.location).toEqual({ lat: '-23.5', lng: '-46.6' })
		})
		expect(result.current.isRequestingLocation).toBe(false)
	})

	it('should set "isRequestingLocation" to true while the request is pending', () => {
		getCurrentPosition.mockImplementation(() => undefined)

		const { result } = renderGeolocationHook()

		requestLocation(result)

		expect(result.current.isRequestingLocation).toBe(true)
	})

	it('should request location only once when "onRequestLocation" is called multiple times', () => {
		mockGeolocationSuccess({ latitude: 0, longitude: 0 })

		const { result } = renderGeolocationHook()

		act(() => {
			result.current.onRequestLocation()
			result.current.onRequestLocation()
		})

		expect(getCurrentPosition).toHaveBeenCalledTimes(1)
	})

	it('should clear "isRequestingLocation" and keep "location" as null when geolocation fails', async () => {
		mockGeolocationError()

		const { result } = renderGeolocationHook()

		requestLocation(result)

		await waitFor(() => {
			expect(result.current.isRequestingLocation).toBe(false)
		})
		expect(result.current.location).toBeNull()
	})

	it('should report an error when geolocation is not supported', () => {
		Reflect.deleteProperty(navigator, 'geolocation')

		const { result } = renderGeolocationHook()

		requestLocation(result)

		expect(getCurrentPosition).not.toHaveBeenCalled()
		expect(consoleError).toHaveBeenCalledWith('Failed to retrieve location', 'Geolocation is not supported')
	})

	it('should format negative coordinates as strings', async () => {
		mockGeolocationSuccess({ latitude: -33.8688, longitude: 151.2093 })

		const { result } = renderGeolocationHook()

		requestLocation(result)

		await waitFor(() => {
			expect(result.current.location).toEqual({ lat: '-33.8688', lng: '151.2093' })
		})
	})

	it('should ignore subsequent requests after the first successful call', async () => {
		mockGeolocationSuccess({ latitude: 1, longitude: 2 })

		const { result } = renderGeolocationHook()

		requestLocation(result)

		await waitFor(() => {
			expect(result.current.location).toEqual({ lat: '1', lng: '2' })
		})

		mockGeolocationSuccess({ latitude: 9, longitude: 9 })

		requestLocation(result)

		expect(getCurrentPosition).toHaveBeenCalledTimes(1)
		expect(result.current.location).toEqual({ lat: '1', lng: '2' })
	})
})
