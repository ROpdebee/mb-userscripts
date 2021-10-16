// https://github.com/NotWoods/rollup-plugin-consts/wiki/Usage-with-TypeScript

declare module 'consts:userscript-name' {
    const userscriptName: string;
    export default userscriptName;
}

declare module 'consts:debug-mode' {
    const debugMode: boolean;
    export default debugMode;
}
