/**
 * Check if value !== undefined && !== null
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return (value as T) !== undefined && (value as T) !== null;
}

/**
 * Check if value !== undefined && !== null && !== ''
 */
export function isStringDefined(
  value: string | null | undefined,
): value is string {
  return isDefined(value) && value !== '';
}

/**
 * Check if array is defined and has length > 0
 */
export function isArrayNotEmpty<T>(
  value: T[] | null | undefined,
): value is T[] {
  return isDefined(value) && value.length > 0;
}

/**
 * Check if object is defined and has at least one property
 */
export function isObjectNotEmpty<T extends Record<string, unknown>>(
  value: T | null | undefined,
): value is T {
  return isDefined(value) && Object.keys(value).length > 0;
}

/**
 * Check if a value is a valid string (i.e. typeof 'string')
 *
 * @param value - The value to check
 * @returns True if the value is a valid string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if a value is a valid number (i.e. typeof 'number' and not NaN)
 *
 * @param value - The value to check
 * @returns True if the value is a valid number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if a value is of boolean type
 *
 * @param value - The value to check
 * @returns True if the value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if the given value is a function.
 *
 * @param value - The value to check.
 * @returns True if the value is a function.
 */
export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

/**
 * Check if the given value is a valid Date object.
 *
 * A valid date is an instance of Date and its internal time value is not NaN.
 *
 * @param value - The value to check.
 * @returns True if the value is a valid Date.
 */
export function isDateValid(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

const CUID_REGEX: RegExp = /^c[^\s-]{8,}$/;

export function isCuid(value: string): boolean {
  return CUID_REGEX.test(value);
}
