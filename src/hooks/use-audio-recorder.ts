import { useCallback, useEffect, useRef, useState } from 'react'

import { MICROPHONE_ERROR_MESSAGES as ERROR_MESSAGES, RECORD_BUTTON_ARIA_LABELS } from '@/constants/ui/audio-recorder'

const SEND_RECORDING_DELAY = 50
const DISCARD_RECORDING_DELAY = 50

interface UseAudioRecorderProps {
	isTranscribing?: boolean
	onTranscription?: (blob: Blob) => void
	onError?: (error: string) => void
	onStartRecording?: VoidFunction
	onStopRecording?: VoidFunction
}

const getRecordButtonAriaLabel = (isTranscribing: boolean, isRecording: boolean) => {
	if (isTranscribing) return RECORD_BUTTON_ARIA_LABELS.SENDING
	if (isRecording) return RECORD_BUTTON_ARIA_LABELS.STOP_AND_SEND
	return RECORD_BUTTON_ARIA_LABELS.RECORD
}

export const useAudioRecorder = ({
	isTranscribing = false,
	onTranscription,
	onError,
	onStartRecording,
	onStopRecording,
}: UseAudioRecorderProps) => {
	const [isRecording, setIsRecording] = useState(false)
	const recordButtonLabel = getRecordButtonAriaLabel(isTranscribing, isRecording)

	const mediaRecorder = useRef<MediaRecorder | null>(null)
	const discardTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const sendTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const recordButtonRef = useRef<HTMLButtonElement>(null)

	const getMediaRecorder = useCallback(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
		mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' })
	}, [])

	const convertBlobToExactMimeType = async (blob: Blob): Promise<Blob> =>
		new Blob([await blob.arrayBuffer()], { type: 'audio/webm' })

	const checkDeviceCompatibility = useCallback(() => {
		if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
			onError?.(ERROR_MESSAGES.DEVICE_NOT_COMPATIBLE)
			return false
		}

		return true
	}, [onError])

	const requestMicrophonePermission = useCallback(async () => {
		try {
			if (navigator.permissions) {
				const status = await navigator.permissions.query({ name: 'microphone' as PermissionName })
				if (status.state === 'granted') return true

				if (status.state === 'denied') {
					onError?.(ERROR_MESSAGES.PERMISSION_DENIED)
					return false
				}

				if (status.state === 'prompt') {
					try {
						const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
						stream.getTracks().forEach((track) => track.stop())

						return false
					} catch {
						onError?.(ERROR_MESSAGES.PERMISSION_DENIED)
						return false
					}
				}
			}

			try {
				const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
				stream.getTracks().forEach((track) => track.stop())
				return false
			} catch {
				onError?.(ERROR_MESSAGES.PERMISSION_DENIED)
				return false
			}
		} catch {
			onError?.(ERROR_MESSAGES.PERMISSION_UNEXPECTED)
			return false
		}
	}, [onError])

	const initializeMediaRecorder = useCallback(async () => {
		try {
			await getMediaRecorder()
			return true
		} catch {
			onError?.(ERROR_MESSAGES.INITIALIZATION)
			return false
		}
	}, [getMediaRecorder, onError])

	const initMicrophone = useCallback(async () => {
		if (!checkDeviceCompatibility()) return false

		const hasPermission = await requestMicrophonePermission()
		if (!hasPermission) return false

		return initializeMediaRecorder()
	}, [checkDeviceCompatibility, initializeMediaRecorder, requestMicrophonePermission])

	const startMediaRecording = useCallback(async () => {
		try {
			onStartRecording?.()
			if (!mediaRecorder.current) return

			mediaRecorder.current.start()
		} catch {
			setIsRecording(false)
			onError?.(ERROR_MESSAGES.START)
		}
	}, [onError, onStartRecording])

	const stopMediaRecorder = () => {
		if (!mediaRecorder.current) return

		mediaRecorder.current.stop()
		mediaRecorder.current.stream.getTracks().forEach((track) => track.stop())
	}

	const stopRecording = useCallback(
		async ({ cancelled }: { cancelled: boolean }) => {
			onStopRecording?.()
			setIsRecording(false)

			if (!mediaRecorder.current) return

			if (cancelled) {
				stopMediaRecorder()
				mediaRecorder.current = null
				return
			}

			mediaRecorder.current.ondataavailable = async (e) => {
				if (e.data.size > 0) {
					try {
						const convertedBlob = await convertBlobToExactMimeType(e.data)
						onTranscription?.(convertedBlob)
					} catch {
						onError?.(ERROR_MESSAGES.BLOB_CONVERSION)
					}
				}
			}

			stopMediaRecorder()
			mediaRecorder.current = null
		},
		[onTranscription, onError, onStopRecording],
	)

	const handleDiscardRecording = useCallback(() => {
		if (discardTimeoutRef.current) clearTimeout(discardTimeoutRef.current)
		if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current)

		discardTimeoutRef.current = setTimeout(() => {
			setIsRecording(false)
			stopRecording({ cancelled: true })
			discardTimeoutRef.current = null
		}, DISCARD_RECORDING_DELAY)
	}, [stopRecording])

	const handleSendRecording = useCallback(async () => {
		if (discardTimeoutRef.current) clearTimeout(discardTimeoutRef.current)
		if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current)

		sendTimeoutRef.current = setTimeout(() => {
			setIsRecording(false)
			stopRecording({ cancelled: false })
			sendTimeoutRef.current = null
		}, SEND_RECORDING_DELAY)
	}, [stopRecording])

	const handleClickStart = useCallback(async () => {
		const micPermission = await initMicrophone()
		if (!micPermission) return

		setIsRecording(true)
		await startMediaRecording()
	}, [initMicrophone, startMediaRecording])

	const handleMicButtonClick = useCallback(async () => {
		if (!isRecording) {
			await handleClickStart()
			return
		}

		await handleSendRecording()
	}, [handleClickStart, handleSendRecording, isRecording])

	useEffect(() => {
		return () => {
			if (discardTimeoutRef.current) clearTimeout(discardTimeoutRef.current)
			if (sendTimeoutRef.current) clearTimeout(sendTimeoutRef.current)

			if (mediaRecorder.current) {
				try {
					if (mediaRecorder.current.state !== 'inactive') mediaRecorder.current.stop()
					mediaRecorder.current.stream.getTracks().forEach((track) => track.stop())
				} finally {
					mediaRecorder.current = null
				}
			}
		}
	}, [])

	return {
		isRecording,
		recordButtonLabel,
		recordButtonRef,
		onDiscardRecording: handleDiscardRecording,
		onRecordButtonClick: handleMicButtonClick,
	}
}
