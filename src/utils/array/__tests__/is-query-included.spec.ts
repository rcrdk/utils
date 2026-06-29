import { describe, expect, it } from 'vitest'

import { isQueryIncluded } from '@/utils/array/is-query-included'

describe('isQueryIncluded', () => {
	it.each([
		['accent-insensitive match', 'sao', 'São Paulo', true],
		['case-insensitive match', 'HELLO', 'hello world', true],
		['match at start', 'hello', 'hello world', true],
		['match in the middle', 'lo wo', 'hello world', true],
		['match at end', 'world', 'hello world', true],
	] as const)('should return true for %s', (_label, query, target, expected) => {
		expect(isQueryIncluded(query, target)).toBe(expected)
	})

	it.each([
		['null query', null, 'São Paulo'],
		['undefined query', undefined, 'São Paulo'],
		['empty query', '', 'São Paulo'],
		['null target', 'sao', null],
		['undefined target', 'sao', undefined],
	] as const)('should return false when %s', (_label, query, target) => {
		expect(isQueryIncluded(query, target)).toBe(false)
	})

	it('should return false when query is not included', () => {
		expect(isQueryIncluded('xyz', 'São Paulo')).toBe(false)
	})

	it('should ignore leading and trailing whitespace in query and target', () => {
		expect(isQueryIncluded('  sao  ', '  São Paulo  ')).toBe(true)
	})
})
