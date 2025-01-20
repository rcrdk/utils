/**
 * Formats a numeric amount as a currency string in Brazilian Real (BRL).
 *
 * This function formats a given amount by dividing it by an optional factor, 
 * then applying a currency format for Brazilian Real (BRL). The formatted 
 * string will include two decimal places and exclude non-numeric characters 
 * (except for commas and periods).
 *
 * @param {number} amount - The amount to format.
 * @param {number} [divideFactor=100] - An optional factor to divide the amount by before formatting. Defaults to 100.
 * @returns {string} The formatted amount as a BRL currency string.
 *
 * @example
 * priceFormatted(10000); // '100,00'
 * priceFormatted(123456, 100); // '1.234,56'
 * priceFormatted(5000, 1); // '5.000,00'
 */
export function priceFormatted(amount: number, divideFactor?: number) {
    const formatted = new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    })
      .format(amount / (divideFactor ?? 100))
      .replace(/[^0-9,.]+/, '')
      .trim()
  
    return formatted
  }
  