// ts-node will not transpile imports of ES modules inside of node_modules.
// Some libraries, like node-fetch, import ES modules. This leads to node errors
// ("require() of ES Module not supported"). Node suggests to "[...] change the
// require to a dynamic import() which is available in all CommonJS modules" but
// the transpiler transpiles dynamic imports to require() calls...
//
// The only viable workaround for this is to do the dynamic import in an `eval`
// call (I know, eww), which isn't touched by the transpiler.
//
// Horrible.
export async function dynamicImport<Result>(modName: string, property = 'default'): Promise<Result> {
    return (await eval(`import('${modName}')`))[property];
}
