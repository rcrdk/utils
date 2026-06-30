import type { Metadata } from 'next'

import '@/styles/globals.css'

import { TanstackQueryProvider } from '@/components/providers/tanstack-query'
import { HTML_CONFIG } from '@/config/html'
import { composeProviders } from '@/utils/app/compose-providers'

interface RootLayoutProps {
	children: React.ReactNode
}

export const metadata: Metadata = {
	title: 'rcrdk.dev | Utilities',
	description: '',
}

const Providers = composeProviders(TanstackQueryProvider)

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
	return (
		<html lang={HTML_CONFIG.LANG}>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
