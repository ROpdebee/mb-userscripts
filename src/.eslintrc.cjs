module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    rules: {
        // Warnings for declarations without initialisation to spot variables without inferred types.
        // This makes it easier to ensure they have type annotations before disabling the warning locally.
        'init-declarations': ['warn', 'always'],
    },
};
