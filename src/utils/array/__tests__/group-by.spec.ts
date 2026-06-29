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
})
