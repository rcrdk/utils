import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names into a single string, handling Tailwind CSS class conflicts.
 *
 * This function merges multiple class names into a single string using `clsx` and resolves conflicts 
 * between Tailwind CSS classes with `tailwind-merge`. It is particularly useful when dynamically 
 * applying conditional or conflicting class names.
 *
 * @param {...ClassValue[]} inputs - An array of class names, conditional classes, or arrays of class names.
 * @returns {string} A single string of merged and conflict-free class names.
 *
 * @example
 * cn('text-lg', 'font-bold', { 'text-red-500': isError }); 
 * // Returns: 'text-lg font-bold text-red-500' (if isError is true)
 *
 * cn('p-4', 'p-2'); 
 * // Returns: 'p-2' (tailwind-merge resolves the conflict)
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
