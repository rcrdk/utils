import { redirect } from 'next/navigation'
import type { z } from 'zod'

import { auth } from '@/auth'
import type { FooUser } from '@/types/foo/user'
import { reportToSentry } from './sentry'

type AuthenticatedUser = FooUser & { userId: string }

export function validatedActionWithUser<TInput extends z.ZodRawShape, TOutput>(
  schema: z.ZodObject<TInput>,
  action: (data: z.infer<z.ZodObject<TInput>>, user: AuthenticatedUser) => Promise<TOutput>,
) {
  return async (values: z.infer<z.ZodObject<TInput>>): Promise<TOutput | null> => {
    try {
      const result = schema.safeParse(values)

      if (!result.success) {
        console.error(result.error.errors)
        return null
      }

      const session = await auth()
      const user = session?.foo

      if (!user?.userId) throw new Error('UNAUTHORIZED')

      const authenticatedUser = user as AuthenticatedUser

      return action(result.data, authenticatedUser)
    } catch (error) {
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        redirect('/login?error=unauthorized')
      }

      reportToSentry(error, {
        fingerprint: ['validatedActionWithUser'],
        tags: {
          action: action.name,
        },
      })

      return null
    }
  }
}

type ActionWithUserFunction<T> = (user: AuthenticatedUser) => Promise<T>

export function actionWithUser<T>(action: ActionWithUserFunction<T>) {
  return async (): Promise<T | null> => {
    try {
      const session = await auth()
      const user = session?.foo

      if (!user?.userId) throw new Error('UNAUTHORIZED')

      const authenticatedUser = user as AuthenticatedUser

      return action(authenticatedUser)
    } catch (error) {
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        redirect('/login?error=unauthorized')
      }

      reportToSentry(error, {
        fingerprint: ['actionWithUser'],
        tags: {
          action: action.name,
        },
      })

      return null
    }
  }
}

export function actionWithUserNoRedirect<T>(action: ActionWithUserFunction<T>) {
  return async (): Promise<T | null> => {
    try {
      const session = await auth()
      const user = session?.foo

      if (!user?.userId) return null

      const authenticatedUser = user as AuthenticatedUser

      return action(authenticatedUser)
    } catch (error) {
      reportToSentry(error, {
        fingerprint: ['actionWithUserNoRedirect'],
        tags: {
          action: action.name,
        },
      })

      return null
    }
  }
}
