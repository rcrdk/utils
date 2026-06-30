export const INDEXED_DB_CONFIG = {
	DB_NAME: 'rcrdk-dev',
	DB_VERSION: 2,
	STORES: [
		{
			name: 'chat-messages',
			options: { keyPath: 'id', autoIncrement: true },
		},
		{
			name: 'react-query',
			options: { keyPath: 'key' },
		},
	],
} as const

export type IndexedDBStoresNames = (typeof INDEXED_DB_CONFIG.STORES)[number]['name']
