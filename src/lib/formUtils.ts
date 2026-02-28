/**
 * Utility functions for form data cleaning and formatting
 */

/**
 * Remove accents from Portuguese text
 * @param text - Input string
 * @returns String without accents
 *
 * Example: "São Paulo" -> "Sao Paulo"
 */
export function removeAccents(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Clean address input - only letters, numbers, space, hyphen
 * Removes accents, commas, and special characters
 * @param text - Raw address input
 * @returns Cleaned address in uppercase
 *
 * Example: "Av. Brigadeiro Luís Antônio, 100" -> "AV BRIGADEIRO LUIS ANTONIO 100"
 */
export function cleanAddressInput(text: string): string {
  return removeAccents(text)
    .toUpperCase()
    .replace(/[^A-Z0-9\s-]/g, "") // Keep only letters, numbers, space, hyphen
    .replace(/,/g, "") // Explicitly remove commas
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
}

/**
 * Clean observations field - max 100 chars, no special chars
 * @param text - Raw observation input
 * @param maxLength - Maximum characters (default 100)
 * @returns Cleaned and truncated observation
 */
export function cleanObservations(text: string, maxLength: number = 100): string {
  return removeAccents(text)
    .replace(/[^a-zA-Z0-9\s\-\.]/g, "") // Keep only letters, numbers, space, hyphen, period
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

/**
 * Format height input - numeric only, max 3 digits
 * @param value - Raw height input
 * @returns Formatted height (numbers only, max 999)
 *
 * Example: "185cm" -> "185", "abc" -> ""
 */
export function formatHeightInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 3);
}

/**
 * Character counter helper
 * @param text - Text to count
 * @param maxLength - Maximum allowed
 * @returns Current count, remaining, and limit status
 */
export function getCharCount(text: string, maxLength: number) {
  return {
    current: text.length,
    remaining: maxLength - text.length,
    isNearLimit: text.length > maxLength * 0.8,
    isAtLimit: text.length >= maxLength,
  };
}
