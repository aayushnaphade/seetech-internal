/**
 * Number rounding utilities
 */

/**
 * Round a number to specified decimal places
 * @param num The number to round
 * @param decimals Number of decimal places
 * @returns Rounded number
 */
export function roundNumber(num: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Format a number with thousands separators and fixed decimal places
 * @param num The number to format
 * @param decimals Number of decimal places
 * @returns Formatted number string
 */
export function formatNumber(num: number, decimals = 2): string {
  return roundNumber(num, decimals).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}
