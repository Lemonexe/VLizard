import globals from 'globals';
import pluginJS from '@eslint/js';
import pluginTS from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';

export default [
    pluginReact.configs.flat.recommended,
    pluginJS.configs.recommended,
    ...pluginTS.configs.recommended,
    {
        ignores: ['**/dist/*', '**/dist-electron/*', '**/release/*', '**/node_modules/*'],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': pluginReactHooks,
        },
        rules: {
            '@typescript-eslint/no-use-before-define': 'error',
            '@typescript-eslint/no-shadow': 'error',
            'import/prefer-default-export': 'off',
            curly: ['error', 'multi-line'],
            'react/require-default-props': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'off',
            'react/sort-comp': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/no-children-prop': 'off',
        },
        settings: { react: { version: 'detect' } },
    },
];
