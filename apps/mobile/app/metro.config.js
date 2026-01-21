const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const root = path.resolve(__dirname, '../..');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    projectRoot: __dirname,
    watchFolders: [
        path.resolve(root, 'packages'),
        path.resolve(root, 'ui'),
        path.resolve(root, 'node_modules'),
    ],
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false,
            },
        }),
    },
    resolver: {
        enableGlobalPackages: true,
        nodeModulesPaths: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(root, 'node_modules'),
        ]
    }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
