const restrictedGlobals = require('confusing-browser-globals');

module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    rules: {
        // Also restrict usage of the GM object, we should always go through the
        // compat layer. Restrict the usage of `fetch` too, we should use the
        // unified request interface instead.
        'no-restricted-globals': ['error', 'origin', 'GM', 'fetch'].concat(restrictedGlobals),
    },
};
