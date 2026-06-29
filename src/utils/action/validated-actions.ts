import { redirect } from 'next/navigation'
import type { z } from 'zod'

import { reportError } from '@/lib/sentry/report-error'

// TODO: Replace with actual user type
type User = {
	id: string
	name: string
	email: string
}

type AuthenticatedActionOptions = {
	disableRedirectOnError?: boolean
}

// TODO: Replace with actual auth function
const auth = async () => {
	return {
		user: {
			id: '1',
			name: 'John Doe',
			email: 'john.doe@example.com',
		},
	}
}

const REDIRECT_URL = '/login'

const getAuthenticatedUser = async (disableRedirectOnError: boolean): Promise<User | null> => {
	const session = await auth()
	const user = session?.user
	const isUnauthorized = !user?.id

	if (isUnauthorized && disableRedirectOnError) return null
	if (isUnauthorized) throw new Error('UNAUTHORIZED')

	return user
}

const handleUnauthorizedError = (error: unknown, disableRedirectOnError: boolean): boolean => {
	const isUnauthorizedError = error instanceof Error && error.message === 'UNAUTHORIZED'

	if (isUnauthorizedError && !disableRedirectOnError) redirect(REDIRECT_URL)

	return isUnauthorizedError
}

export const validatedActionWithUser =
	<TInput extends z.ZodRawShape, TOutput>(
		schema: z.ZodObject<TInput>,
		action: (data: z.infer<z.ZodObject<TInput>>, user: User) => Promise<TOutput>,
		options?: Readonly<AuthenticatedActionOptions>,
	) =>
	async (values: z.infer<z.ZodObject<TInput>>): Promise<TOutput | null> => {
		const { disableRedirectOnError = false } = options ?? {}

		try {
			const result = schema.safeParse(values)

			if (!result.success) {
				console.error(result.error.issues)
				return null
			}

			const user = await getAuthenticatedUser(disableRedirectOnError)
			if (!user) return null

			return action(result.data, user)
		} catch (error) {
			const isUnauthorizedError = handleUnauthorizedError(error, disableRedirectOnError)
			if (isUnauthorizedError) return null

			reportError({ error })

			return null
		}
	}

export const actionWithUser =
	<T>(action: (user: User) => Promise<T>, options?: Readonly<AuthenticatedActionOptions>) =>
	async (): Promise<T | null> => {
		const { disableRedirectOnError = false } = options ?? {}

		try {
			const user = await getAuthenticatedUser(disableRedirectOnError)
			if (!user) return null

			return action(user)
		} catch (error) {
			const isUnauthorizedError = handleUnauthorizedError(error, disableRedirectOnError)
			if (isUnauthorizedError) return null

			reportError({ error })

			return null
		}
	}
