// TODO: Need to perform an actual type check of sorts.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function safeParseJSON<T>(jsonText: string): T | undefined;
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function safeParseJSON<T>(jsonText: string, errorMessage: string): T;
export function safeParseJSON<T>(jsonText: string, errorMessage?: string): T | undefined {
    try {
        return JSON.parse(jsonText) as T;
    } catch (error) {
        if (errorMessage) {
            // If an error message is defined, we should re-throw with a custom
            // error.
            throw new Error(`${errorMessage}: ${error}`);
        }
        return undefined;
    }
}
