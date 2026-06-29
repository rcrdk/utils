import { describe, expect, it } from 'vitest'

import { cn } from '@/utils/ui/tw'

describe('Cn', () => {
	it.each([
		['merge class names', ['px-4', 'py-2'], 'px-4 py-2'],
		['ignore falsy values', ['px-4', false && 'bg-blue-500'], 'px-4'],
		['resolve conflicting tailwind utilities', ['px-4', 'px-2'], 'px-2'],
	] as const)('should %s', (_label, inputs, expected) => {
		const className = cn(...inputs)

		expect(className).toBe(expected)
	})

	it('should return an empty string when no classes are provided', () => {
		expect(cn()).toBe('')
	})
})
