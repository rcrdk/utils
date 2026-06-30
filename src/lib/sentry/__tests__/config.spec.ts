import { afterEach, describe, expect, it, vi } from 'vitest'

describe('SentryConfig', () => {
	afterEach(() => {
		vi.resetModules()
		vi.unstubAllEnvs()
	})

	it('should enable Sentry when "NEXT_PUBLIC_SENTRY_DSN" is configured', async () => {
		vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', 'https://example@sentry.io/1')

		const { isSentryEnabled } = await import('@/lib/sentry/config')

		expect(isSentryEnabled).toBe(true)
	})

	it('should disable Sentry when "NEXT_PUBLIC_SENTRY_DSN" is not configured', async () => {
		vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', '')

		const { isSentryEnabled } = await import('@/lib/sentry/config')

		expect(isSentryEnabled).toBe(false)
	})

	it('should return client options with the configured DSN and environment', async () => {
		vi.stubEnv('NODE_ENV', 'test')
		vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', 'https://example@sentry.io/1')
		vi.stubEnv('NEXT_PUBLIC_SENTRY_ENVIRONMENT', 'development')

		const { getClientSentryOptions } = await import('@/lib/sentry/config')

		const options = getClientSentryOptions()

		expect(options).toEqual({
			dsn: 'https://example@sentry.io/1',
			enabled: true,
			environment: 'development',
			tracesSampleRate: 1,
		})
	})

	it('should return server options with the configured DSN and environment', async () => {
		vi.stubEnv('NODE_ENV', 'production')
		vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', 'https://example@sentry.io/1')

		const { getServerSentryOptions } = await import('@/lib/sentry/config')

		const options = getServerSentryOptions()

		expect(options).toEqual({
			dsn: 'https://example@sentry.io/1',
			enabled: true,
			environment: 'production',
			tracesSampleRate: 0.1,
		})
	})

	it('should return edge options with the configured DSN', async () => {
		vi.stubEnv('NODE_ENV', 'test')
		vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', 'https://example@sentry.io/1')

		const { getEdgeSentryOptions } = await import('@/lib/sentry/config')

		const options = getEdgeSentryOptions()

		expect(options).toEqual({
			dsn: 'https://example@sentry.io/1',
			enabled: true,
			environment: 'test',
			tracesSampleRate: 1,
		})
	})
})
