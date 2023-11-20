module.exports = {
    env: { browser: true, es2020: true },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
    parser: '@typescript-eslint/parser',
    parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    plugins: ['react-refresh', 'react-hooks'],
    rules: {
        'react-refresh/only-export-components': 'off',
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/no-shadow': 'error',
        'import/prefer-default-export': 'off',
        curly: ['error', 'multi'],
        'react/require-default-props': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'off',
        'react/sort-comp': 'off',
    },
};
