// https://github.com/NotWoods/rollup-plugin-consts/wiki/Usage-with-TypeScript

declare module 'consts:userscript-id' {
    const USERSCRIPT_ID: string;
    export default USERSCRIPT_ID;
}

declare module 'consts:debug-mode' {
    const DEBUG_MODE: boolean;
    export default DEBUG_MODE;
}

declare module 'consts:userscript-feature-history' {
    interface Feature {
        versionAdded: string;
        description: string;
    }
    const USERSCRIPT_FEATURE_HISTORY: Feature[];
    export default USERSCRIPT_FEATURE_HISTORY;
}

declare module 'consts:changelog-url' {
    const CHANGELOG_URL: string;
    export default CHANGELOG_URL;
}
