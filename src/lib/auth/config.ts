import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

import { AUTH_CONFIG } from '@/config/auth'
import { env } from '@/lib/env'

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [
		Google({
			clientId: env.AUTH_GOOGLE_ID,
			clientSecret: env.AUTH_GOOGLE_SECRET,
		}),
	],
	pages: {
		signIn: AUTH_CONFIG.LOGIN_PATH,
	},
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		jwt({ token, user }) {
			if (user?.id) token.sub = user.id
			return token
		},
		session({ session, token }) {
			if (session.user && token.sub) session.user.id = token.sub
			return session
		},
	},
	secret: env.AUTH_SECRET,
	trustHost: true,
})
