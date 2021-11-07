import 'jest-extended';

interface CloneIntoOptions {
    cloneFunctions: boolean;
    wrapReflectors: boolean;
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cloneInto: <T>(obj: T, targetScope: any, options?: CloneIntoOptions) => T;
    interface Window {
        $: typeof jQuery;
    }
}

export {};
