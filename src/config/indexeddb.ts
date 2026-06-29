export const INDEXED_DB_CONFIG = {
	DB_NAME: 'rcrdk-dev',
	DB_VERSION: 1,
	STORES: [
		{
			name: 'chat-messages',
			options: { keyPath: 'id', autoIncrement: true },
		},
	],
} as const

export type IndexedDBStoresNames = (typeof INDEXED_DB_CONFIG.STORES)[number]['name']
