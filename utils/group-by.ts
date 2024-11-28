/**
 * Replaces `Object.groupBy(items, callbackFn)` by a fallback function `groupBy(objectArray, 'someObjectKey')`
 *
 * @example
 * ```typescript
 * const posts = [
 *  {
 *    category: 'Category 01';
 *    title: 'Some title';
 *  },
 *  {
 *    category: 'Category 01';
 *    title: 'Another title';
 *  },
 *  {
 *    category: 'Category 02';
 *    title: 'Another title';
 *  },
 * ]
 *
 * groupBy(posts, 'category')
 * ```
 **/
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
