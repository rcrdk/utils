import { describe, expect, it } from 'vitest'

import { groupBy } from '@/utils/array/group-by'

describe('GroupBy', () => {
	it('should group items by the given key', () => {
		const items = [
			{ status: 'open', id: 1 },
			{ status: 'closed', id: 2 },
			{ status: 'open', id: 3 },
		]

		const grouped = groupBy(items, 'status')

		expect(grouped.open).toEqual([
			{ status: 'open', id: 1 },
			{ status: 'open', id: 3 },
		])
		expect(grouped.closed).toEqual([{ status: 'closed', id: 2 }])
	})

	it('should return an empty object for an empty collection', () => {
		const grouped = groupBy([], 'status')

		expect(grouped).toEqual({})
	})

	it('should place a single item in its group', () => {
		const items = [{ status: 'open', id: 1 }]

		const grouped = groupBy(items, 'status')

		expect(grouped.open).toEqual([{ status: 'open', id: 1 }])
	})

	it('should preserve item order within each group', () => {
		const items = [
			{ status: 'open', id: 1 },
			{ status: 'open', id: 2 },
			{ status: 'open', id: 3 },
		]

		const grouped = groupBy(items, 'status')

		expect(grouped.open?.map((item) => item.id)).toEqual([1, 2, 3])
	})

	it('should group by numeric keys', () => {
		const items = [
			{ priority: 1, label: 'low' },
			{ priority: 2, label: 'medium' },
			{ priority: 1, label: 'low-again' },
		]

		const grouped = groupBy(items, 'priority')

		expect(grouped[1]).toEqual([
			{ priority: 1, label: 'low' },
			{ priority: 1, label: 'low-again' },
		])
		expect(grouped[2]).toEqual([{ priority: 2, label: 'medium' }])
	})

	it('should group by boolean keys', () => {
		const items = [
			{ active: true, id: 'a' },
			{ active: false, id: 'b' },
			{ active: true, id: 'c' },
		]

		const grouped = groupBy(items, 'active')

		expect(grouped.true).toHaveLength(2)
		expect(grouped.false).toHaveLength(1)
	})

	it('should not mutate the input collection', () => {
		const items = [
			{ status: 'open', id: 1 },
			{ status: 'closed', id: 2 },
		]
		const snapshot = [...items]

		groupBy(items, 'status')

		expect(items).toEqual(snapshot)
	})

	it('should keep separate array references per group', () => {
		const items = [
			{ status: 'a', id: 1 },
			{ status: 'b', id: 2 },
			{ status: 'a', id: 3 },
		]

		const grouped = groupBy(items, 'status')

		expect(grouped.a).not.toBe(grouped.b)
		grouped.a?.push({ status: 'a', id: 4 })

		expect(grouped.b).toEqual([{ status: 'b', id: 2 }])
	})
})
