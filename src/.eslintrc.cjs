const restrictedGlobals = require('confusing-browser-globals');

module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    rules: {
        // Warnings for declarations without initialisation to spot variables without inferred types.
        // This makes it easier to ensure they have type annotations before disabling the warning locally.
        'init-declarations': ['warn', 'always'],
        // Also restrict usage of the GM object, we should always go through the
        // compat layer.
        'no-restricted-globals': ['error', 'origin', 'GM'].concat(restrictedGlobals),
    },
    overrides: [{
        files: ['*.d.ts'],
        rules: {
            'init-declarations': 'off',
        },
    }],
};
