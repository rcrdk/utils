import { describe, expect, it } from 'vitest'

import { generateSlug } from '@/utils/string/generate-slug'

describe('GenerateSlug', () => {
	it.each([
		['null input', null],
		['undefined input', undefined],
		['empty string', ''],
	] as const)('should return null for %s', (_label, input) => {
		expect(generateSlug(input)).toBeNull()
	})

	it.each([
		['basic text', 'Hello World', 'hello-world'],
		['accents and special characters', 'São Paulo — Centro!!!', 'sao-paulo-centro'],
		['repeated hyphens and spaces', 'foo   bar---baz', 'foo-bar-baz'],
		['leading and trailing spaces', '  trimmed slug  ', 'trimmed-slug'],
	] as const)('should normalize %s into a slug', (_label, input, expected) => {
		expect(generateSlug(input)).toBe(expected)
	})

	it('should return an empty string for whitespace-only input', () => {
		expect(generateSlug('   ')).toBe('')
	})

	it.each([
		['numeric segments', 'Room 404', 'room-404'],
		['emoji and symbols', 'Hello 🚀 World!!!', 'hello-world'],
		['german umlauts', 'Müller Straße', 'muller-strae'],
		['cyrillic text', 'Москва центр', '-'],
		['multiple consecutive separators', '---foo---bar---', '-foo-bar-'],
	] as const)('should handle %s', (_label, input, expected) => {
		expect(generateSlug(input)).toBe(expected)
	})

	it('should preserve existing hyphens between words', () => {
		expect(generateSlug('pre-built modules')).toBe('pre-built-modules')
	})

	it('should not mutate the input string', () => {
		const input = 'São Paulo'
		const snapshot = input

		generateSlug(input)

		expect(input).toBe(snapshot)
	})
})
