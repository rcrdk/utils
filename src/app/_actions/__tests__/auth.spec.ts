import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AUTH_CONFIG } from '@/config/auth'

const signIn = vi.hoisted(() => vi.fn())
const signOut = vi.hoisted(() => vi.fn())

vi.mock('@/lib/auth/config', () => ({
	signIn,
	signOut,
}))

describe('SignInWithGoogleAction', () => {
	beforeEach(() => {
		signIn.mockReset()
		signIn.mockResolvedValue(undefined)
	})

	it('should call "signIn" with the Google provider and default redirect path', async () => {
		const { signInWithGoogleAction } = await import('@/app/_actions/auth')

		await signInWithGoogleAction()

		expect(signIn).toHaveBeenCalledWith('google', { redirectTo: AUTH_CONFIG.DEFAULT_REDIRECT_PATH })
	})
})

describe('SignOutAction', () => {
	beforeEach(() => {
		signOut.mockReset()
		signOut.mockResolvedValue(undefined)
	})

	it('should call "signOut" with the sign-out redirect path', async () => {
		const { signOutAction } = await import('@/app/_actions/auth')

		await signOutAction()

		expect(signOut).toHaveBeenCalledWith({ redirectTo: AUTH_CONFIG.SIGN_OUT_REDIRECT_PATH })
	})
})
