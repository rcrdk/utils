import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PolymorphicComponent } from '@/components/examples/polymorphic-component'

describe('PolymorphicComponent component', () => {
	it('should render as a paragraph by default', () => {
		render(<PolymorphicComponent>Hello world</PolymorphicComponent>)

		const text = screen.getByText('Hello world')

		expect(text.tagName).toBe('P')
	})

	it.each([
		['span', 'Inline label', 'SPAN'],
		['h1', 'Page heading', 'H1'],
	] as const)('should render as "%s" when "as" is "%s"', (element, content, tagName) => {
		render(<PolymorphicComponent as={element}>{content}</PolymorphicComponent>)

		const text = screen.getByText(content)

		expect(text.tagName).toBe(tagName)
	})

	it('should forward props to the rendered element', () => {
		render(
			<PolymorphicComponent as="h1" id="page-title">
				Page heading
			</PolymorphicComponent>,
		)

		const heading = screen.getByRole('heading', { level: 1, name: 'Page heading' })

		expect(heading).toHaveAttribute('id', 'page-title')
	})

	it.each([
		['default paragraph', undefined, 'Default snapshot'],
		['span', 'span', 'Span snapshot'],
		['heading', 'h1', 'Heading snapshot'],
	] as const)('should match snapshot for %s', (_label, element, content) => {
		const { container } = render(
			element ? (
				<PolymorphicComponent as={element}>{content}</PolymorphicComponent>
			) : (
				<PolymorphicComponent>{content}</PolymorphicComponent>
			),
		)

		expect(container).toMatchSnapshot()
	})
})
