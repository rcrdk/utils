/**
 * Groups an array of objects by a specific key.
 *
 * This function takes a collection of objects and groups them into an object, 
 * where the keys are unique values of the specified property, and the values 
 * are arrays of objects that share the same key value.
 *
 * @template T - The type of objects in the collection.
 * @template K - The key of the property to group by, which must exist in T.
 * @param {T[]} collection - The array of objects to group.
 * @param {K} key - The key to group the objects by.
 * @returns {Record<T[K], T[]>} An object where the keys are the unique values 
 * of the specified property, and the values are arrays of objects that share 
 * that key.
 *
 * @example
 * const data = [
 *   { id: 1, category: 'A' },
 *   { id: 2, category: 'B' },
 *   { id: 3, category: 'A' },
 * ];
 *
 * const grouped = groupBy(data, 'category');
 * // Result:
 * // {
 * //   A: [
 * //     { id: 1, category: 'A' },
 * //     { id: 3, category: 'A' },
 * //   ],
 * //   B: [
 * //     { id: 2, category: 'B' },
 * //   ],
 * // }
 */
export function groupBy<T extends Record<K, PropertyKey>, K extends keyof T>(
  collection: T[],
  key: K,
) {
  const grouped = collection.reduce(
    (previous, current) => {
      if (!previous[current[key]]) {
        previous[current[key]] = [] as T[]
      }

      previous[current[key]].push(current)
      return previous
    },
    {} as Record<T[K], T[]>,
  )

  return grouped
}
