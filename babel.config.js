// Same as MBS
const BROWSER_TARGETS = {
    chrome: '49',
    edge: '14',
    firefox: '52',
    ie: '11',
    safari: '9.0',
};

export default {
    presets: [
        ['@babel/preset-env', {
            corejs: '3',
            targets: BROWSER_TARGETS,
            useBuiltIns: 'usage',
        }],
    ],
    sourceType: 'unambiguous',
};
