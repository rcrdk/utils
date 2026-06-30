import type { Persister } from '@tanstack/query-persist-client-core'

import { persistClient, removeClient, restoreClient } from './persister-methods'

export const createQueryClientPersister = (): Persister => ({ persistClient, restoreClient, removeClient })
