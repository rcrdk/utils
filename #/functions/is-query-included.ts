/**
 * Checks if the query string is included in the stringToCompare after normalization.
 *
 * @param {string} query - The substring to search for.
 * @param {string} stringToCompare - The string in which to search.
 * @returns {boolean} True if the query is included, otherwise false.
 */
export function isQueryIncluded(query: string, stringToCompare: string): boolean {
    const normalizeAndClean = (str: string): string =>
      str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
  
    const normalizedQuery = normalizeAndClean(query);
    const normalizedStringToCompare = normalizeAndClean(stringToCompare);
  
    const index = normalizedStringToCompare.indexOf(normalizedQuery);
  
    if (index !== -1) {
      const matchedSubstring = normalizedStringToCompare.slice(index, index + normalizedQuery.length);
      return matchedSubstring.localeCompare(normalizedQuery, undefined, { sensitivity: 'base' }) === 0;
    }
  
    return false;
  }