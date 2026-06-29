import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

import { env } from './src/env'

const isCi = ['1', 'true'].includes(env.CI ?? '')

const nextConfig: NextConfig = {
	reactStrictMode: true,
	reactCompiler: true,
	productionBrowserSourceMaps: true,
	experimental: {
		serverActions: {
			bodySizeLimit: '10mb',
		},
	},
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
					{
						key: 'X-DNS-Prefetch-Control',
						value: 'on',
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
					{
						key: 'Cross-Origin-Opener-Policy',
						value: 'same-origin allow-popups',
					},
				],
			},
		]
	},
}

export default withSentryConfig(nextConfig, {
	org: env.SENTRY_ORG,
	project: env.SENTRY_PROJECT,
	silent: !isCi,
	widenClientFileUpload: true,
	disableLogger: true,
	tunnelRoute: '/monitoring',
})
