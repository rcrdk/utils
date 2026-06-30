import { contextLinesIntegration, type BrowserOptions, type EdgeOptions, type NodeOptions } from '@sentry/nextjs'

import { env, isProduction } from '@/lib/env'

export const isSentryEnabled = Boolean(env.NEXT_PUBLIC_SENTRY_DSN)

const getEnvironment = () => env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? env.NODE_ENV

const getTracesSampleRate = () => (isProduction ? 0.1 : 1)

const getBaseSentryOptions = () => ({
	dsn: env.NEXT_PUBLIC_SENTRY_DSN,
	enabled: isSentryEnabled,
	environment: getEnvironment(),
	tracesSampleRate: getTracesSampleRate(),
})

export const getClientSentryOptions = (): BrowserOptions => ({
	...getBaseSentryOptions(),
})

export const getServerSentryOptions = (): NodeOptions => ({
	...getBaseSentryOptions(),
	integrations: [contextLinesIntegration()],
})

export const getEdgeSentryOptions = (): EdgeOptions => ({
	...getBaseSentryOptions(),
})
