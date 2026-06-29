import { afterEach, describe, expect, it, vi } from 'vitest'

import { normalizeError } from '@/lib/sentry/normalize-error'

const captureException = vi.hoisted(() => vi.fn())

vi.mock('@sentry/nextjs', () => ({
	captureException,
}))

describe('NormalizeError', () => {
	it('should return the same Error instance when input is already an Error', () => {
		const originalError = new Error('already an error')

		const normalizedError = normalizeError(originalError)

		expect(normalizedError).toBe(originalError)
	})

	it('should wrap string errors in an Error', () => {
		const normalizedError = normalizeError('something failed')

		expect(normalizedError).toBeInstanceOf(Error)
		expect(normalizedError.message).toBe('something failed')
	})

	it('should wrap object errors with a message property', () => {
		const normalizedError = normalizeError({ name: 'CustomError', message: 'object failure' })

		expect(normalizedError).toBeInstanceOf(Error)
		expect(normalizedError.message).toBe('object failure')
		expect(normalizedError.name).toBe('CustomError')
		expect(normalizedError.cause).toEqual({ name: 'CustomError', message: 'object failure' })
	})

	it('should wrap unknown values with a fallback message', () => {
		const normalizedError = normalizeError(null)

		expect(normalizedError.message).toBe('Unknown error')
		expect(normalizedError.cause).toBeNull()
	})
})

describe('ReportError', () => {
	afterEach(() => {
		captureException.mockClear()
		vi.resetModules()
		vi.unstubAllEnvs()
	})

	it('should log to console outside production', async () => {
		vi.stubEnv('NODE_ENV', 'test')
		vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', 'https://example@sentry.io/1')

		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
		const { reportError } = await import('@/lib/sentry/report-error')

		reportError({ error: new Error('copy failed'), message: 'Failed to copy text:' })

		expect(consoleError).toHaveBeenCalledWith('Failed to copy text:', expect.any(Error))
		consoleError.mockRestore()
	})

	it('should capture normalized errors in Sentry when DSN is configured', async () => {
		vi.stubEnv('NODE_ENV', 'production')
		vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', 'https://example@sentry.io/1')

		const { reportError } = await import('@/lib/sentry/report-error')

		reportError({
			error: 'quota exceeded',
			context: {
				tags: { operation: 'save' },
			},
		})

		expect(captureException).toHaveBeenCalledWith(expect.objectContaining({ message: 'quota exceeded' }), {
			tags: { operation: 'save' },
		})
	})

	it('should skip Sentry capture when DSN is not configured', async () => {
		vi.stubEnv('NODE_ENV', 'production')
		vi.stubEnv('NEXT_PUBLIC_SENTRY_DSN', '')

		const { reportError } = await import('@/lib/sentry/report-error')

		reportError({ error: new Error('ignored') })

		expect(captureException).not.toHaveBeenCalled()
	})
})
