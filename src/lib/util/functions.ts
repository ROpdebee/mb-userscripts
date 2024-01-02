/**
 * Convert a function into a memoized function which caches its return value.
 *
 * An optional key function can be provided. This can be used to override
 * function application equivalence checks. Such checks are used to determine
 * when a subsequent evaluation of the function can reuse an old value, and
 * which old application can be reused.
 *
 * @param      {(...args:T)=>V}       fn      The function to memoize.
 * @param      {(...args:T)=>string}  keyFn   Function to extract a
 *                                              memoization key.
 * @return     {(...args:T)=>V}       Memoized version of `fn`.
 */
export function memoize<T extends unknown[], V>(function_: (...arguments_: T) => V, keyFunction: (arguments_: T) => string = (arguments_): string => `${arguments_[0]}`): (...arguments_: T) => V {
    const memoMap = new Map<string, V>();

    return (...arguments_: T): V => {
        // We're requiring the memoization key to be a string to ensure proper
        // equality checks. Not the best solution, but it works.
        const key = keyFunction(arguments_);
        if (!memoMap.has(key)) {
            const result = function_(...arguments_);
            memoMap.set(key, result);
        }
        return memoMap.get(key)!;
    };
}
