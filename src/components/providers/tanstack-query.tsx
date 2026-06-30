'use client'

import { type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'

import { useQueryClientRestore } from '@/hooks/use-query-client-restore'
import { queryClient } from '@/lib/tanstack-query'

interface TanstackQueryProviderProps {
	children: ReactNode
}

export function TanstackQueryProvider({ children }: Readonly<TanstackQueryProviderProps>) {
	const isWaitingForRestore = useQueryClientRestore()

	if (isWaitingForRestore) return null

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
