const { jestNativePreset } = require('@react-native/jest-preset');

module.exports = {
    ...jestNativePreset,
    testMatch: [
        '<rootDir>/__tests__/**/*.(test|spec).[jt]s?(x)',
    ],
    passWithNoTests: true,
};
