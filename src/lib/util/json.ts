export function safeParseJSON<T>(jsonText: string): T | undefined;
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
