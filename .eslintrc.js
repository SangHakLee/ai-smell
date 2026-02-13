module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
    ],
    env: {
        node: true,
        jest: true,
    },
    rules: {
        // You can add custom rules here
    },
};