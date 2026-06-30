import type { ComponentProps } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AudioRecorder } from '@/components/examples/audio-recorder'
import { RECORD_BUTTON_ARIA_LABELS } from '@/constants/ui/audio-recorder'

type AudioRecorderProps = ComponentProps<typeof AudioRecorder>

const transcribeAction = vi.fn().mockResolvedValue({ text: 'transcribed text' })

const defaultProps = {
	transcribeAction,
	onTranscription: vi.fn(),
	onError: vi.fn(),
} satisfies Pick<AudioRecorderProps, 'transcribeAction' | 'onTranscription' | 'onError'>

const renderAudioRecorder = (props: Partial<AudioRecorderProps> = {}) =>
	render(<AudioRecorder {...defaultProps} {...props} />)

describe('AudioRecorder component', () => {
	it('should render the record button with default aria label', () => {
		renderAudioRecorder()

		const recordButton = screen.getByRole('button', { name: RECORD_BUTTON_ARIA_LABELS.RECORD })

		expect(recordButton).toBeInTheDocument()
		expect(recordButton).toHaveAttribute('data-testid', 'audio-recorder-button')
	})

	it('should disable the record button when "disabled" is true', () => {
		renderAudioRecorder({ disabled: true })

		const recordButton = screen.getByRole('button', { name: RECORD_BUTTON_ARIA_LABELS.RECORD })

		expect(recordButton).toBeDisabled()
	})

	it('should call "onSubmit" instead of starting recording when "onSubmit" is provided', () => {
		const onSubmit = vi.fn()

		renderAudioRecorder({ onSubmit })

		fireEvent.click(screen.getByRole('button', { name: RECORD_BUTTON_ARIA_LABELS.RECORD }))

		expect(onSubmit).toHaveBeenCalledTimes(1)
	})

	it('should match snapshot', () => {
		const { container } = renderAudioRecorder()

		expect(container).toMatchSnapshot()
	})
})
