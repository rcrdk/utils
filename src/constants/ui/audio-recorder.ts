export const MICROPHONE_ERROR_MESSAGES = {
	DEVICE_NOT_COMPATIBLE: 'Your browser does not support audio recording.',
	PERMISSION_DENIED: 'Microphone access was denied. Enable it in your browser settings and try again.',
	PERMISSION_UNEXPECTED: 'An unexpected error occurred while checking microphone permissions.',
	INITIALIZATION: 'Could not initialize the microphone. Check your device and try again.',
	START: 'Could not start recording. Try again.',
	BLOB_CONVERSION: 'Could not process the recorded audio. Try recording again.',
} as const

export const AUDIO_TRANSCRIPTION_ERROR_MESSAGES = {
	EMPTY: 'No speech was detected in the recording.',
	UNEXPECTED: 'An unexpected error occurred while transcribing the audio.',
} as const

export const RECORD_BUTTON_ARIA_LABELS = {
	SENDING: 'Enviando áudio...',
	STOP_AND_SEND: 'Parar gravação e enviar',
	RECORD: 'Gravar áudio',
} as const
