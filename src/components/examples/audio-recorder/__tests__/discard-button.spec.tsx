import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DiscardButton } from '@/components/examples/audio-recorder/discard-button'

const defaultProps = {
	isRecording: true,
	onDiscard: vi.fn(),
}

const renderDiscardButton = (props: Partial<typeof defaultProps> = {}) =>
	render(<DiscardButton {...defaultProps} {...props} />)

describe('DiscardButton component', () => {
	it('should render nothing when "isRecording" is false', () => {
		const { container } = renderDiscardButton({ isRecording: false })

		expect(container).toBeEmptyDOMElement()
	})

	it('should render a discard button when "isRecording" is true', () => {
		renderDiscardButton()

		const discardButton = screen.getByRole('button', { name: 'Cancelar gravação' })

		expect(discardButton).toBeInTheDocument()
	})

	it('should call "onDiscard" when clicked', () => {
		const onDiscard = vi.fn()

		renderDiscardButton({ onDiscard })

		fireEvent.click(screen.getByRole('button', { name: 'Cancelar gravação' }))

		expect(onDiscard).toHaveBeenCalledTimes(1)
	})

	it.each([
		['recording', true],
		['hidden', false],
	] as const)('should match snapshot when "isRecording" is %s', (_label, isRecording) => {
		const { container } = renderDiscardButton({ isRecording })

		expect(container).toMatchSnapshot()
	})
})
