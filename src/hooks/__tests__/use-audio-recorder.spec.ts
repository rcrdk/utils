import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { MICROPHONE_ERROR_MESSAGES, RECORD_BUTTON_ARIA_LABELS } from '@/constants/ui/audio-recorder'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'

const SEND_RECORDING_DELAY = 50

type MockMediaRecorderInstance = {
	state: string
	stream: MediaStream
	ondataavailable: ((event: { data: Blob }) => void) | null
	start: ReturnType<typeof vi.fn>
	stop: ReturnType<typeof vi.fn>
}

const createMockMediaRecorder = () => {
	const mockTrack = { stop: vi.fn() }
	const mockStream = { getTracks: () => [mockTrack] } as unknown as MediaStream
	const instances: MockMediaRecorderInstance[] = []

	const MockMediaRecorder = vi.fn(function MockMediaRecorder(this: MockMediaRecorderInstance) {
		this.state = 'inactive'
		this.stream = mockStream
		this.ondataavailable = null
		this.start = vi.fn(() => {
			this.state = 'recording'
		})
		this.stop = vi.fn(() => {
			this.state = 'inactive'
			this.ondataavailable?.({ data: new Blob(['audio'], { type: 'audio/webm' }) })
		})

		instances.push(this)
	}) as unknown as typeof MediaRecorder

	return { MockMediaRecorder, instances, mockStream, mockTrack }
}

const defaultOptions = {
	onTranscription: vi.fn(),
	onError: vi.fn(),
	onStartRecording: vi.fn(),
	onStopRecording: vi.fn(),
}

const renderRecorderHook = (options: Partial<typeof defaultOptions & { isTranscribing?: boolean }> = {}) =>
	renderHook(() =>
		useAudioRecorder({
			...defaultOptions,
			...options,
		}),
	)

describe('UseAudioRecorder', () => {
	let mediaRecorderMock: ReturnType<typeof createMockMediaRecorder>
	let getUserMedia: ReturnType<typeof vi.fn>
	let queryPermission: ReturnType<typeof vi.fn>

	beforeEach(() => {
		vi.useFakeTimers()
		mediaRecorderMock = createMockMediaRecorder()
		getUserMedia = vi.fn().mockResolvedValue(mediaRecorderMock.mockStream)
		queryPermission = vi.fn().mockResolvedValue({ state: 'granted' })

		vi.stubGlobal('MediaRecorder', mediaRecorderMock.MockMediaRecorder)
		Object.assign(navigator, {
			mediaDevices: { getUserMedia },
			permissions: { query: queryPermission },
		})
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.unstubAllGlobals()
	})

	it('should initialize with "isRecording" as false and default record label', () => {
		const { result } = renderRecorderHook()

		expect(result.current.isRecording).toBe(false)
		expect(result.current.recordButtonLabel).toBe(RECORD_BUTTON_ARIA_LABELS.RECORD)
	})

	it('should return "RECORD_BUTTON_ARIA_LABELS.SENDING" when "isTranscribing" is true', () => {
		const { result } = renderRecorderHook({ isTranscribing: true })

		expect(result.current.recordButtonLabel).toBe(RECORD_BUTTON_ARIA_LABELS.SENDING)
	})

	it('should call "onError" with "MICROPHONE_ERROR_MESSAGES.DEVICE_NOT_COMPATIBLE" when media devices are unavailable', async () => {
		Object.assign(navigator, { mediaDevices: undefined })
		const onError = vi.fn()

		const { result } = renderRecorderHook({ onError })

		await act(async () => {
			await result.current.onRecordButtonClick()
		})

		expect(onError).toHaveBeenCalledWith(MICROPHONE_ERROR_MESSAGES.DEVICE_NOT_COMPATIBLE)
		expect(result.current.isRecording).toBe(false)
	})

	it('should call "onError" with "MICROPHONE_ERROR_MESSAGES.PERMISSION_DENIED" when microphone permission is denied', async () => {
		queryPermission.mockResolvedValue({ state: 'denied' })
		const onError = vi.fn()

		const { result } = renderRecorderHook({ onError })

		await act(async () => {
			await result.current.onRecordButtonClick()
		})

		expect(onError).toHaveBeenCalledWith(MICROPHONE_ERROR_MESSAGES.PERMISSION_DENIED)
	})

	it('should start recording and update the record label when microphone access is granted', async () => {
		const onStartRecording = vi.fn()
		const { result } = renderRecorderHook({ onStartRecording })

		await act(async () => {
			await result.current.onRecordButtonClick()
		})

		expect(onStartRecording).toHaveBeenCalledTimes(1)
		expect(result.current.isRecording).toBe(true)
		expect(result.current.recordButtonLabel).toBe(RECORD_BUTTON_ARIA_LABELS.STOP_AND_SEND)
		expect(mediaRecorderMock.instances.at(0)?.start).toHaveBeenCalledTimes(1)
	})

	it('should send the recording blob to "onTranscription" when the record button is clicked twice', async () => {
		const onTranscription = vi.fn()
		const onStopRecording = vi.fn()
		const { result } = renderRecorderHook({ onTranscription, onStopRecording })

		await act(async () => {
			await result.current.onRecordButtonClick()
		})

		await act(async () => {
			await result.current.onRecordButtonClick()
		})

		await act(async () => {
			vi.advanceTimersByTime(SEND_RECORDING_DELAY)
		})

		expect(onStopRecording).toHaveBeenCalledTimes(1)
		expect(onTranscription).toHaveBeenCalledTimes(1)
		expect(onTranscription.mock.calls.at(0)?.at(0)).toBeInstanceOf(Blob)
		expect(result.current.isRecording).toBe(false)
	})

	it('should discard the recording when "onDiscardRecording" is called', async () => {
		const onTranscription = vi.fn()
		const { result } = renderRecorderHook({ onTranscription })

		await act(async () => {
			await result.current.onRecordButtonClick()
		})

		act(() => {
			result.current.onDiscardRecording()
		})

		await act(async () => {
			vi.advanceTimersByTime(SEND_RECORDING_DELAY)
		})

		expect(onTranscription).not.toHaveBeenCalled()
		expect(result.current.isRecording).toBe(false)
	})
})
