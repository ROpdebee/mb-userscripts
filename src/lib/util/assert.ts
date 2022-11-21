/**
 * Assertion helpers.
 */

export class AssertionError extends Error {}

/**
 * Assert a condition.
 *
 * @param      {boolean}            condition  The condition
 * @param      {string}             message    The message
 */
export function assert(condition: boolean, message?: string): asserts condition {
    if (!condition) {
        throw new AssertionError(message ?? 'Assertion failed');
    }
}

/**
 * Assert that a value is not undefined.
 *
 * @param      {any}            value    The value
 * @param      {string}         message  The message
 */
export function assertDefined<T>(value: T, message?: string): asserts value is Exclude<T, undefined> {
    assert(value !== undefined, message ?? 'Assertion failed: Expected value to be defined');
}

/**
 * Assert that a value is not null.
 *
 * @param      {any}            value    The value
 * @param      {string}         message  The message
 */
export function assertNonNull<T>(value: T, message?: string): asserts value is Exclude<T, null> {
    assert(value !== null, message ?? 'Assertion failed: Expected value to be non-null');
}

/**
 * Assert that a value is neither null nor undefined.
 *
 * @param      {any}            value    The value
 * @param      {string}         message  The message
 */
export function assertHasValue<T>(value: T, message?: string): asserts value is NonNullable<T> {
    assert(value !== undefined && value !== null, message ?? 'Assertion failed: Expected value to be defined and non-null');
}
