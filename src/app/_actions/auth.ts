'use server'

import { AUTH_CONFIG } from '@/config/auth'
import { signIn, signOut } from '@/lib/auth/config'

export const signInWithGoogleAction = async () => {
	await signIn('google', { redirectTo: AUTH_CONFIG.DEFAULT_REDIRECT_PATH })
}

export const signOutAction = async () => {
	await signOut({ redirectTo: AUTH_CONFIG.SIGN_OUT_REDIRECT_PATH })
}
