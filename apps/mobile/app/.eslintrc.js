module.exports = {
    root: true,
    extends: [
        'plugin:react-hooks/recommended',
        '@react-native',
    ],
    overrides: [
        {
            files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
            extends: ['plugin:testing-library/react'],
        },
    ],
};
