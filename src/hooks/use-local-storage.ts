import { useCallback } from 'react'
import type { z } from 'zod'

type LocalStorageOperation = 'get' | 'save' | 'clear'

type ReportLocalStorageErrorParams = {
	error: unknown
	operation: LocalStorageOperation
	localStorageKey: string
}

// TODO: Implement error reporting
const reportError = ({ error, operation, localStorageKey }: ReportLocalStorageErrorParams) => {
	console.error(`Local storage ${operation} failed for key "${localStorageKey}":`, error)
}

const isLocalStorageAvailable = () => typeof window !== 'undefined'

type GetStoredValueFromLocalStorageParams<T> = {
	localStorageKey: string
	schema: z.ZodType<T>
}

const getStoredValueFromLocalStorage = <T>({ localStorageKey, schema }: GetStoredValueFromLocalStorageParams<T>) => {
	if (!isLocalStorageAvailable()) return null

	try {
		const item = window.localStorage.getItem(localStorageKey)
		if (!item) return null

		const parsed = JSON.parse(item) as unknown
		const validationResult = schema.safeParse(parsed)

		if (!validationResult.success) return null

		return validationResult.data
	} catch (error) {
		reportError({ error, operation: 'get', localStorageKey })
		return null
	}
}

type SaveValueToLocalStorageParams<T> = {
	localStorageKey: string
	value: T
}

const saveValueToLocalStorage = <T>({ localStorageKey, value }: SaveValueToLocalStorageParams<T>) => {
	if (!isLocalStorageAvailable()) return

	try {
		window.localStorage.setItem(localStorageKey, JSON.stringify(value))
	} catch (error) {
		reportError({ error, operation: 'save', localStorageKey })
	}
}

type ClearValueFromLocalStorageParams = {
	localStorageKey: string
}

const clearValueFromLocalStorage = ({ localStorageKey }: ClearValueFromLocalStorageParams) => {
	if (!isLocalStorageAvailable()) return

	try {
		window.localStorage.removeItem(localStorageKey)
	} catch (error) {
		reportError({ error, operation: 'clear', localStorageKey })
	}
}

type UseLocalStorageParams<T> = {
	localStorageKey: string
	schema: z.ZodType<T>
}

export const useLocalStorage = <T>({ localStorageKey, schema }: UseLocalStorageParams<T>) => {
	const getLocalValue = useCallback(
		() => getStoredValueFromLocalStorage({ localStorageKey, schema }),
		[localStorageKey, schema],
	)

	const saveLocalValue = useCallback(
		(value: T) => saveValueToLocalStorage({ localStorageKey, value }),
		[localStorageKey],
	)

	const clearLocalValue = useCallback(() => clearValueFromLocalStorage({ localStorageKey }), [localStorageKey])

	return { getLocalValue, saveLocalValue, clearLocalValue }
}
