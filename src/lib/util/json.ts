/**
 * Parse JSON.
 *
 * @param      {string}  jsonText  The JSON source text.
 * @return     {T}       Parsed JSON object if successful, `undefined` is failed.
 */
export function safeParseJSON<T>(jsonText: string): T | undefined;
/**
 * Parse JSON.
 *
 * @param      {string}  jsonText      The JSON source text.
 * @param      {string}  errorMessage  Message to throw when JSON parsing
 *                                     fails.
 * @return     {T}       Parsed JSON object if successful.
 * @throws           Error when JSON parsing fails.
 */
export function safeParseJSON<T>(jsonText: string, errorMessage: string): T;
export function safeParseJSON<T>(jsonText: string, errorMessage?: string): T | undefined {
    try {
        return JSON.parse(jsonText) as T;
    } catch (err) {
        if (errorMessage) {
            // If an error message is defined, we should re-throw with a custom
            // error.
            throw new Error(`${errorMessage}: ${err}`);
        }
        return undefined;
    }
}
