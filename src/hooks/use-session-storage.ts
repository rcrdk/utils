import { useCallback } from 'react'
import type { z } from 'zod'

type SessionStorageOperation = 'get' | 'save' | 'clear'

type ReportSessionStorageErrorParams = {
	error: unknown
	operation: SessionStorageOperation
	sessionStorageKey: string
}

// TODO: Implement error reporting
const reportError = ({ error, operation, sessionStorageKey }: ReportSessionStorageErrorParams) => {
	console.error(`Session storage ${operation} failed for key "${sessionStorageKey}":`, error)
}

const isSessionStorageAvailable = () => typeof window !== 'undefined'

type GetStoredValueFromSessionStorageParams<T> = {
	sessionStorageKey: string
	schema: z.ZodType<T>
}

const getStoredValueFromSessionStorage = <T>({
	sessionStorageKey,
	schema,
}: GetStoredValueFromSessionStorageParams<T>) => {
	if (!isSessionStorageAvailable()) return null

	try {
		const item = window.sessionStorage.getItem(sessionStorageKey)
		if (!item) return null

		const parsed = JSON.parse(item) as unknown
		const validationResult = schema.safeParse(parsed)

		if (!validationResult.success) return null

		return validationResult.data
	} catch (error) {
		reportError({ error, operation: 'get', sessionStorageKey })
		return null
	}
}

type SaveValueToSessionStorageParams<T> = {
	sessionStorageKey: string
	value: T
}

const saveValueToSessionStorage = <T>({ sessionStorageKey, value }: SaveValueToSessionStorageParams<T>) => {
	if (!isSessionStorageAvailable()) return

	try {
		window.sessionStorage.setItem(sessionStorageKey, JSON.stringify(value))
	} catch (error) {
		reportError({ error, operation: 'save', sessionStorageKey })
	}
}

type ClearValueFromSessionStorageParams = {
	sessionStorageKey: string
}

const clearValueFromSessionStorage = ({ sessionStorageKey }: ClearValueFromSessionStorageParams) => {
	if (!isSessionStorageAvailable()) return

	try {
		window.sessionStorage.removeItem(sessionStorageKey)
	} catch (error) {
		reportError({ error, operation: 'clear', sessionStorageKey })
	}
}

type UseSessionStorageParams<T> = {
	sessionStorageKey: string
	schema: z.ZodType<T>
}

export const useSessionStorage = <T>({ sessionStorageKey, schema }: UseSessionStorageParams<T>) => {
	const getSessionValue = useCallback(
		() => getStoredValueFromSessionStorage({ sessionStorageKey, schema }),
		[sessionStorageKey, schema],
	)

	const saveSessionValue = useCallback(
		(value: T) => saveValueToSessionStorage({ sessionStorageKey, value }),
		[sessionStorageKey],
	)

	const clearSessionValue = useCallback(() => clearValueFromSessionStorage({ sessionStorageKey }), [sessionStorageKey])

	return { getSessionValue, saveSessionValue, clearSessionValue }
}
