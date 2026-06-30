import type { Metadata } from 'next'

import '@/styles/globals.css'

import { TanstackQueryProvider } from '@/components/providers/tanstack-query'
import { composeProviders } from '@/utils/app/compose-providers'

export const metadata: Metadata = {
	title: 'rcrdk.dev | Utilities',
	description: '',
}

const Providers = composeProviders(TanstackQueryProvider)

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
