import { useCallback } from 'react'
import type { z } from 'zod'

import { reportError } from '@/lib/sentry/report-error'

type SessionStorageOperation = 'get' | 'save' | 'clear'

type ReportSessionStorageErrorParams = {
	error: unknown
	operation: SessionStorageOperation
	sessionStorageKey: string
}

const reportSessionStorageError = ({ error, operation, sessionStorageKey }: ReportSessionStorageErrorParams) => {
	reportError({
		error,
		message: `Session storage ${operation} failed for key "${sessionStorageKey}":`,
		context: {
			tags: { operation, storageType: 'session' },
			extra: { sessionStorageKey },
		},
	})
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
		reportSessionStorageError({ error, operation: 'get', sessionStorageKey })
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
		reportSessionStorageError({ error, operation: 'save', sessionStorageKey })
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
		reportSessionStorageError({ error, operation: 'clear', sessionStorageKey })
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
