// This function is purely to keep test cases descriptive.
export function itBehavesLike<T>(spec: (specArgs: T) => void, specArgs: T): void {
    spec(specArgs);
}
