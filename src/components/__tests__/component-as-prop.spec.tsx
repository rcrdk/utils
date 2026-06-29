import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Text } from '@/components/component-as-prop'

describe('Text component', () => {
	it('should render as a paragraph by default', () => {
		render(<Text>Hello world</Text>)

		const text = screen.getByText('Hello world')

		expect(text.tagName).toBe('P')
	})

	it.each([
		['span', 'Inline label', 'SPAN'],
		['h1', 'Page heading', 'H1'],
	] as const)('should render as "%s" when "as" is "%s"', (element, content, tagName) => {
		render(<Text as={element}>{content}</Text>)

		const text = screen.getByText(content)

		expect(text.tagName).toBe(tagName)
	})

	it('should forward props to the rendered element', () => {
		render(
			<Text as="h1" id="page-title">
				Page heading
			</Text>,
		)

		const heading = screen.getByRole('heading', { level: 1, name: 'Page heading' })

		expect(heading).toHaveAttribute('id', 'page-title')
	})

	it.each([
		['default paragraph', undefined, 'Default snapshot'],
		['span', 'span', 'Span snapshot'],
		['heading', 'h1', 'Heading snapshot'],
	] as const)('should match snapshot for %s', (_label, element, content) => {
		const { container } = render(element ? <Text as={element}>{content}</Text> : <Text>{content}</Text>)

		expect(container).toMatchSnapshot()
	})
})
