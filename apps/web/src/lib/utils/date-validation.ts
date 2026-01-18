/**
 * Date validation utilities for campaign scheduling
 */

/**
 * Validate that a Date object is valid
 * @throws Error with 400 status code if invalid
 */
export function assertValidDate(date: Date, fieldName: string = 'date'): void {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    const error = new Error(`Invalid ${fieldName}: must be a valid ISO date string`);
    (error as any).statusCode = 400;
    throw error;
  }
}

/**
 * Parse and validate an ISO datetime string
 * @returns Valid Date object
 * @throws Error with 400 status code if invalid
 */
export function parseAndValidateDate(dateString: string, fieldName: string = 'date'): Date {
  const date = new Date(dateString);
  assertValidDate(date, fieldName);
  return date;
}

/**
 * Add days to a date, preserving time
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Format date for display
 */
export function formatScheduledDate(date: Date, timezone: string = 'Europe/Vilnius'): string {
  return new Intl.DateTimeFormat('lt-LT', {
    timeZone: timezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
