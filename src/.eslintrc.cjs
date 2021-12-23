const restrictedGlobals = require('confusing-browser-globals');

module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    rules: {
        // Also restrict usage of the GM object, we should always go through the
        // compat layer.
        'no-restricted-globals': ['error', 'origin', 'GM'].concat(restrictedGlobals),
    },
};
