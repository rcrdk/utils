import { beforeEach, describe, expect, it, vi } from 'vitest'

const auth = vi.hoisted(() => vi.fn())

vi.mock('server-only', () => ({}))

vi.mock('@/lib/auth/config', () => ({
	auth,
}))

describe('GetSessionUser', () => {
	beforeEach(() => {
		auth.mockReset()
	})

	it('should return null when there is no session', async () => {
		auth.mockResolvedValue(null)

		const { getSessionUser } = await import('@/lib/auth/get-session-user')

		const result = await getSessionUser()

		expect(result).toBeNull()
	})

	it('should return null when the session user is missing an "id"', async () => {
		auth.mockResolvedValue({
			user: { name: 'John Doe', email: 'john.doe@example.com' },
		})

		const { getSessionUser } = await import('@/lib/auth/get-session-user')

		const result = await getSessionUser()

		expect(result).toBeNull()
	})

	it('should return null when the session user is missing an "email"', async () => {
		auth.mockResolvedValue({
			user: { id: '1', name: 'John Doe' },
		})

		const { getSessionUser } = await import('@/lib/auth/get-session-user')

		const result = await getSessionUser()

		expect(result).toBeNull()
	})

	it('should return null when the session user is missing a "name"', async () => {
		auth.mockResolvedValue({
			user: { id: '1', email: 'john.doe@example.com' },
		})

		const { getSessionUser } = await import('@/lib/auth/get-session-user')

		const result = await getSessionUser()

		expect(result).toBeNull()
	})

	it('should return a mapped "User" when the session is valid', async () => {
		auth.mockResolvedValue({
			user: { id: '1', name: 'John Doe', email: 'john.doe@example.com' },
		})

		const { getSessionUser } = await import('@/lib/auth/get-session-user')

		const result = await getSessionUser()

		expect(result).toEqual({
			id: '1',
			name: 'John Doe',
			email: 'john.doe@example.com',
		})
	})
})
