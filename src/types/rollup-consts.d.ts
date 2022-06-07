// https://github.com/NotWoods/rollup-plugin-consts/wiki/Usage-with-TypeScript

declare module 'consts:userscript-id' {
    const USERSCRIPT_ID: string;
    export default USERSCRIPT_ID;
}

declare module 'consts:debug-mode' {
    const DEBUG_MODE: boolean;
    export default DEBUG_MODE;
}
