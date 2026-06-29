import { beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { actionWithUser, validatedActionWithUser } from '@/utils/action/validated-actions'

const redirect = vi.hoisted(() => vi.fn())

vi.mock('next/navigation', () => ({
	redirect,
}))

const taskSchema = z.object({
	title: z.string(),
})

describe('ValidatedActionWithUser', () => {
	beforeEach(() => {
		redirect.mockClear()
	})

	it('should return the action result when input is valid', async () => {
		const saveTask = validatedActionWithUser(taskSchema, async (data, user) => ({
			title: data.title,
			userId: user.id,
		}))

		const result = await saveTask({ title: 'Follow up' })

		expect(result).toEqual({ title: 'Follow up', userId: '1' })
	})

	it('should return null when validation fails', async () => {
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

		const saveTask = validatedActionWithUser(taskSchema, async (data) => data.title)

		const invalidInput = { title: 123 } as unknown as z.infer<typeof taskSchema>
		const result = await saveTask(invalidInput)

		expect(result).toBeNull()
		consoleError.mockRestore()
	})

	it('should reject when the action throws a non-unauthorized error', async () => {
		const saveTask = validatedActionWithUser(taskSchema, async () => {
			throw new Error('save failed')
		})

		await expect(saveTask({ title: 'Follow up' })).rejects.toThrow('save failed')
	})

	it('should not redirect when "disableRedirectOnError" is true', async () => {
		const saveTask = validatedActionWithUser(
			taskSchema,
			async (data, user) => ({
				title: data.title,
				userId: user.id,
			}),
			{ disableRedirectOnError: true },
		)

		const result = await saveTask({ title: 'Follow up' })

		expect(result).toEqual({ title: 'Follow up', userId: '1' })
		expect(redirect).not.toHaveBeenCalled()
	})
})

describe('ActionWithUser', () => {
	beforeEach(() => {
		redirect.mockClear()
	})

	it('should return the action result for an authenticated user', async () => {
		const loadProfile = actionWithUser(async (user) => user.email)

		const result = await loadProfile()

		expect(result).toBe('john.doe@example.com')
	})

	it('should not redirect when "disableRedirectOnError" is enabled', async () => {
		const loadProfile = actionWithUser(async (user) => user.email, { disableRedirectOnError: true })

		const result = await loadProfile()

		expect(result).toBe('john.doe@example.com')
		expect(redirect).not.toHaveBeenCalled()
	})

	it('should reject when the action throws a non-unauthorized error', async () => {
		const loadProfile = actionWithUser(async () => {
			throw new Error('load failed')
		})

		await expect(loadProfile()).rejects.toThrow('load failed')
	})
})
