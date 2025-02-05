import type { FormEvent } from 'react'
import {
	startTransition as startTransitionFn,
	useState,
	useTransition,
} from 'react'
import { requestFormReset } from 'react-dom'

interface FormState {
	success: boolean
	message: string | null
	errors: Record<string, string[]> | null
}

/**
 * Custom hook to manage form state, inspired by React DOM's `useFormState`.
 *
 * @param {function(FormData): Promise<FormState>} action - The server action that processes the form data.
 * @param {Object} [options] - Optional settings for the form state behavior.
 * @param {FormState} [options.initialState] - The initial state of the form.
 * @param {function(): (Promise<void> | void)} [options.onSuccess] - Callback function triggered on successful form submission.
 * @param {boolean} [options.resetFormOnSuccess=false] - Whether to reset the form on successful submission.
 * @param {boolean} [options.resetStateMessage=false] - Whether to reset the state message after a delay.
 * @returns {[FormState, function(FormEvent<HTMLFormElement>): void, boolean]} - Returns form state, submit handler, and pending state.
 */
export function useFormState(
	action: (data: FormData) => Promise<FormState>,
	options?: {
		initialState?: FormState
		onSuccess?: () => Promise<void> | void
		resetFormOnSuccess?: boolean
		resetStateMessage?: boolean
	},
) {
	const [isPending, startTransition] = useTransition()

	const [formState, setFormState] = useState(
		options?.initialState ?? { success: false, message: null, errors: null },
	)

	/**
   * Handles form submission, preventing default behavior and updating form state.
   *
   * @param {FormEvent<HTMLFormElement>} event - The form submission event.
   */
	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const form = event.currentTarget
		const data = new FormData(form)

		startTransition(async () => {
			const state = await action(data)

			if (state.success && options?.resetFormOnSuccess) {
				startTransitionFn(() => {
					requestFormReset(form)
				})
			}

			if (state.success && options?.onSuccess) {
				await options.onSuccess()
			}

			setFormState(state)

			if (options?.resetStateMessage) {
				setTimeout(() => {
					setFormState((prev) => {
						return {
							...prev,
							message: null,
						}
					})
				}, 500)
			}
		})
	}

	return [formState, handleSubmit, isPending] as const
}
