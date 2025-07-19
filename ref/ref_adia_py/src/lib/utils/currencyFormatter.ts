/**
 * Currency formatter utility for Indian Rupees and other currencies
 * Ported from Python's format_indian_number function
 */

/**
 * Format a number to Indian number system (lakhs, crores)
 * @param num The number to format
 * @param appendSymbol Whether to append the currency symbol
 * @returns Formatted string with Indian number formatting
 */
export function formatIndianNumber(num: number, appendSymbol = false): string {
  // Convert to string with commas for Indian numbering system
  // (e.g., 10,00,000 for 1 million)
  const numStr = num.toString();
  const parts = numStr.split('.');
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
  
  let result = '';
  let count = 0;
  
  // Process the integer part from right to left
  for (let i = integerPart.length - 1; i >= 0; i--) {
    count++;
    result = integerPart[i] + result;
    
    // Add commas according to Indian numbering system
    if (i !== 0 && count % 3 === 0 && count !== integerPart.length) {
      result = ',' + result;
    } else if (i !== 0 && count === 3) {
      // After the first thousand
      result = ',' + result;
    }
  }
  
  // Add decimal part back
  result += decimalPart;
  
  // Add currency symbol if requested
  if (appendSymbol) {
    return '₹' + result;
  }
  
  return result;
}

/**
 * Format a number as currency
 * Uses Indian number system by default
 * @param amount The amount to format
 * @param currency The currency code (default: 'INR')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency = 'INR'): string {
  if (currency === 'INR') {
    return formatIndianNumber(amount, true);
  }
  
  // For other currencies, use the standard Intl formatter
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
