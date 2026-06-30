import * as Sentry from '@sentry/nextjs'

import { isProduction } from '@/lib/env'
import { isSentryEnabled } from '@/lib/sentry/config'
import { normalizeError } from '@/lib/sentry/normalize-error'

type ReportErrorContext = {
	tags?: Record<string, string>
	extra?: Record<string, unknown>
	fingerprint?: string[]
	level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug'
}

type ReportErrorParams = {
	error: unknown
	message?: string
	context?: ReportErrorContext
}

const shouldLogToConsole = !isProduction

export const reportError = ({ error, message, context }: Readonly<ReportErrorParams>) => {
	if (shouldLogToConsole) {
		if (message) console.error(message, error)
		else console.error(error)
	}

	if (!isSentryEnabled) return

	const normalizedError = normalizeError(error)

	Sentry.captureException(normalizedError, context)
}
