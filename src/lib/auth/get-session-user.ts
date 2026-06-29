import 'server-only'

import { auth } from '@/lib/auth/config'
import type { User } from '@/types/auth/user'

export const getSessionUser = async (): Promise<User | null> => {
	const session = await auth()
	const sessionUser = session?.user

	if (!sessionUser?.id || !sessionUser.email || !sessionUser.name) return null

	const user: User = {
		id: sessionUser.id,
		name: sessionUser.name,
		email: sessionUser.email,
	}

	return user
}
