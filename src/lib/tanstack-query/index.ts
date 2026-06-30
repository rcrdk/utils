import { QueryClient } from '@tanstack/react-query'

import { REACT_QUERY_CONFIG } from '@/config/tanstack-query'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: REACT_QUERY_CONFIG.staleTime,
			gcTime: REACT_QUERY_CONFIG.gcTime,
			retry: REACT_QUERY_CONFIG.retry,
			refetchOnWindowFocus: REACT_QUERY_CONFIG.refetchOnWindowFocus,
			refetchOnReconnect: REACT_QUERY_CONFIG.refetchOnReconnect,
		},
	},
})
