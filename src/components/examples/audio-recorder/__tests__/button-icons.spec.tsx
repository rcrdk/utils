import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AudioRecorderButtonIcons } from '@/components/examples/audio-recorder/icons'

const defaultProps = {
	isTranscribing: false,
	isRecording: false,
}

const renderButtonIcons = (props: Partial<typeof defaultProps> = {}) =>
	render(<AudioRecorderButtonIcons {...defaultProps} {...props} />)

describe('AudioRecorderButtonIcons component', () => {
	it.each([
		['transcribing', { isTranscribing: true, isRecording: false }, 'audio-recorder-button-icon-transcribing'],
		['recording', { isTranscribing: false, isRecording: true }, 'audio-recorder-button-icon-recording'],
		['record', { isTranscribing: false, isRecording: false }, 'audio-recorder-button-icon-record'],
	] as const)('should render the %s icon', (_label, props, testId) => {
		renderButtonIcons(props)

		expect(screen.getByTestId(testId)).toBeInTheDocument()
	})

	it('should prioritize the transcribing icon over the recording icon', () => {
		renderButtonIcons({ isTranscribing: true, isRecording: true })

		expect(screen.getByTestId('audio-recorder-button-icon-transcribing')).toBeInTheDocument()
		expect(screen.queryByTestId('audio-recorder-button-icon-recording')).not.toBeInTheDocument()
	})

	it.each([
		['transcribing', { isTranscribing: true, isRecording: false }],
		['recording', { isTranscribing: false, isRecording: true }],
		['record', { isTranscribing: false, isRecording: false }],
	] as const)('should match snapshot for %s state', (_label, props) => {
		const { container } = renderButtonIcons(props)

		expect(container).toMatchSnapshot()
	})
})
