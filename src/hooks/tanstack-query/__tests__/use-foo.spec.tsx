import { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useFoo } from '@/hooks/tanstack-query/use-foo'

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	})

	const Wrapper = ({ children }: Readonly<{ children: ReactNode }>) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)

	return Wrapper
}

describe('UseFoo', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('should fetch foo data', async () => {
		const foo = { id: '1', message: 'foo' }

		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: () => Promise.resolve(foo),
			}),
		)

		const { result } = renderHook(() => useFoo(), { wrapper: createWrapper() })

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true)
		})

		expect(result.current.foo).toEqual(foo)
	})

	it('should expose an error when the fetch fails', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: false,
			}),
		)

		const { result } = renderHook(() => useFoo(), { wrapper: createWrapper() })

		await waitFor(() => {
			expect(result.current.isError).toBe(true)
		})

		expect(result.current.error).toEqual(new Error('Failed to fetch foo'))
	})

	it('should accept "useQuery" options such as "enabled"', async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ id: '1', message: 'foo' }),
		})

		vi.stubGlobal('fetch', fetchMock)

		renderHook(() => useFoo({ enabled: false }), { wrapper: createWrapper() })

		expect(fetchMock).not.toHaveBeenCalled()
	})
})
