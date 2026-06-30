'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

import '@/styles/globals.css'

import { HTML_CONFIG } from '@/config/html'

interface Props {
	error: Error & { digest?: string }
}

export default function GlobalError({ error }: Readonly<Props>) {
	useEffect(() => {
		Sentry.captureException(error)
	}, [error])

	return (
		<html lang={HTML_CONFIG.LANG}>
			<body>
				<h1>Something went wrong</h1>
			</body>
		</html>
	)
}
