import 'fake-indexeddb/auto'

import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const persistQueryClient = vi.hoisted(() => vi.fn())
const createQueryClientPersister = vi.hoisted(() => vi.fn())
const reportError = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/query-persist-client-core', () => ({
	persistQueryClient,
}))

vi.mock('@/lib/tanstack-query/persister', () => ({
	createQueryClientPersister: createQueryClientPersister,
}))

vi.mock('@/lib/sentry/report-error', () => ({
	reportError,
}))

const importUseQueryClientRestore = async () => {
	vi.resetModules()

	const hookModule = await import('@/hooks/use-query-client-restore')

	return hookModule.useQueryClientRestore
}

describe('UseQueryClientRestore', () => {
	afterEach(() => {
		vi.clearAllMocks()
		vi.unstubAllEnvs()
	})

	it('should not wait when "SKIP_CACHE_RESTORE" is true', async () => {
		vi.stubEnv('SKIP_CACHE_RESTORE', 'true')

		const useQueryClientRestore = await importUseQueryClientRestore()
		const { result } = renderHook(() => useQueryClientRestore())

		expect(result.current).toBe(false)
		expect(persistQueryClient).not.toHaveBeenCalled()
	})

	it('should wait until restore completes when persistence is enabled', async () => {
		vi.stubEnv('SKIP_CACHE_RESTORE', 'false')

		const unsubscribe = vi.fn()
		let resolveRestore!: VoidFunction
		const restorePromise = new Promise<void>((resolve) => {
			resolveRestore = resolve
		})

		persistQueryClient.mockReturnValue([unsubscribe, restorePromise])
		createQueryClientPersister.mockReturnValue({})

		const useQueryClientRestore = await importUseQueryClientRestore()
		const { result } = renderHook(() => useQueryClientRestore())

		expect(result.current).toBe(true)

		resolveRestore()

		await waitFor(() => {
			expect(result.current).toBe(false)
		})
	})

	it('should stop waiting when restore fails', async () => {
		vi.stubEnv('SKIP_CACHE_RESTORE', 'false')

		const unsubscribe = vi.fn()
		const restoreError = new Error('restore failed')
		const restorePromise = Promise.reject(restoreError)

		persistQueryClient.mockReturnValue([unsubscribe, restorePromise])
		createQueryClientPersister.mockReturnValue({})

		const useQueryClientRestore = await importUseQueryClientRestore()
		const { result } = renderHook(() => useQueryClientRestore())

		await waitFor(() => {
			expect(result.current).toBe(false)
		})

		expect(reportError).toHaveBeenCalledWith({
			error: restoreError,
			message: 'Failed to restore Tanstack Query client',
		})
	})

	it('should unsubscribe on unmount', async () => {
		vi.stubEnv('SKIP_CACHE_RESTORE', 'false')

		const unsubscribe = vi.fn()
		const restorePromise = Promise.resolve()

		persistQueryClient.mockReturnValue([unsubscribe, restorePromise])
		createQueryClientPersister.mockReturnValue({})

		const useQueryClientRestore = await importUseQueryClientRestore()
		const { unmount } = renderHook(() => useQueryClientRestore())

		unmount()

		expect(unsubscribe).toHaveBeenCalledTimes(1)
	})
})
