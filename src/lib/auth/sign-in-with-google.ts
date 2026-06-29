import 'server-only'

import { AUTH_CONFIG } from '@/config/auth'
import { signIn } from '@/lib/auth/config'

export const signInWithGoogle = async () => await signIn('google', { redirectTo: AUTH_CONFIG.DEFAULT_REDIRECT_PATH })
