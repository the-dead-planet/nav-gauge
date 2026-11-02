module.exports = {
    preset: '@react-native/jest-preset',
    testMatch: ['<rootDir>/__tests__/**/*.test.tsx'],
    moduleNameMapper: {
        '^@ui$': '<rootDir>/../common/src',
        '^@tinker-chest$': '<rootDir>/../../tinker-chest/src',
    },
};
