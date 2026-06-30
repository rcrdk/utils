const SIXTY_MINUTES_IN_MS = 60 * 60 * 1000

export const REACT_QUERY_CONFIG = {
	staleTime: SIXTY_MINUTES_IN_MS,
	gcTime: SIXTY_MINUTES_IN_MS,
	retry: 1,
	refetchOnWindowFocus: false,
	refetchOnReconnect: false,
}

export const REACT_QUERY_CACHE_KEY = 'REACT_QUERY_OFFLINE_CACHE'
