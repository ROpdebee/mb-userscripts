// This function is purely to keep test cases descriptive.
export function itBehavesLike<T>(spec: (specificationArguments: T) => void, specificationArguments: T): void {
    spec(specificationArguments);
}
