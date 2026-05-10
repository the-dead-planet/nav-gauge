const { FlatCompat } = require('@eslint/eslintrc');
const prettierConfig = require('eslint-config-prettier');
const customRule = require('./eslint-rules/no-cross-gear-imports');

const compat = new FlatCompat({
    baseDirectory: __dirname,
    resolvePluginsRelativeTo: __dirname,
});

module.exports = [
    ...compat.config({
        extends: [
            'plugin:react-hooks/recommended',
            'plugin:@typescript-eslint/recommended',
        ],
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            '@typescript-eslint/no-restricted-types': 'error',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            'no-unused-vars': 'off',
            'no-constant-binary-expression': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
            }],
            '@typescript-eslint/explicit-member-accessibility': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            eqeqeq: 'error',
            curly: 'error',
            indent: ['warn', 4, { SwitchCase: 1 }],
            semi: ['warn', 'always'],
            'eol-last': ['warn', 'always'],
            radix: ['error', 'always'],
            '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
            'react-hooks/exhaustive-deps': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/refs': 'off',
        },
    }),

    {
        plugins: {
            local: {
                rules: {
                    'no-cross-gear-imports': customRule,
                },
            },
        },
        rules: {
            'local/no-cross-gear-imports': 'error',
        },
    },
    prettierConfig,
];
