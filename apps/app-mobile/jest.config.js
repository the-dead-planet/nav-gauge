module.exports = {
    preset: 'react-native',
    testMatch: [
        '<rootDir>/__tests__/**/*.(test|spec).[jt]s?(x)',
    ],
    transformIgnorePatterns: [
        'node_modules/(?!(@react-native|@react-native-async-storage|@testing-library)/)',
    ],
};
