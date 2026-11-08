const path = require('node:path');

const workspaceRoot = path.resolve(__dirname, '../..');

module.exports = {
    preset: '@react-native/jest-preset',
    testMatch: ['<rootDir>/__tests__/**/*.(test|spec).[jt]s?(x)'],
    transform: {
        '^.+\\.[jt]sx?$': [
            'babel-jest',
            {
                babelrc: false,
                configFile: false,
                presets: ['module:@react-native/babel-preset'],
            },
        ],
    },
    moduleNameMapper: {
        '^@apparatus$': path.join(workspaceRoot, 'apparatus/common/src'),
        '^@mobile-apparatus$': path.join(workspaceRoot, 'apparatus/mobile/src'),
        '^@tinker-chest$': path.join(workspaceRoot, 'tinker-chest/src'),
        '^@ui$': path.join(workspaceRoot, 'ui/common/src'),
        '^@mobile-ui$': path.join(workspaceRoot, 'ui/mobile/src'),
    },
};
