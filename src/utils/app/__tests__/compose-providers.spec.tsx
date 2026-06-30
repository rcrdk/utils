import { type ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { composeProviders } from '@/utils/app/compose-providers'

const OuterProvider = ({ children }: Readonly<{ children: ReactNode }>) => (
	<div data-testid="outer-provider">{children}</div>
)

const InnerProvider = ({ children }: Readonly<{ children: ReactNode }>) => (
	<div data-testid="inner-provider">{children}</div>
)

describe('ComposeProviders', () => {
	it('should render children when no providers are passed', () => {
		const ComposedProviders = composeProviders()

		render(<ComposedProviders>content</ComposedProviders>)

		expect(screen.getByText('content')).toBeInTheDocument()
	})

	it('should nest providers outside-in in argument order', () => {
		const ComposedProviders = composeProviders(OuterProvider, InnerProvider)

		render(
			<ComposedProviders>
				<span>content</span>
			</ComposedProviders>,
		)

		const outerProvider = screen.getByTestId('outer-provider')
		const innerProvider = screen.getByTestId('inner-provider')

		expect(outerProvider).toContainElement(innerProvider)
		expect(innerProvider).toHaveTextContent('content')
	})
})
