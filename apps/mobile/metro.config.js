const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');

const extraNodeModules = fs
    .readdirSync(path.resolve(root, 'gears'), { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .reduce((acc, dir) => {
        acc[`@the-dead-planet/nav-gauge-gears-${dir.name}`] = path.resolve(root, `gears/${dir.name}/common/src`);
        acc[`@the-dead-planet/nav-gauge-mobile-gears-${dir.name}`] = path.resolve(root, `gears/${dir.name}/mobile/src`);

        return acc;
    }, {});

const gearsWatchFolders = fs
    .readdirSync(path.resolve(root, 'gears'), { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .reduce((acc, dir) => {
        acc.push(path.resolve(root, `gears/${dir.name}/common`));
        acc.push(path.resolve(root, `gears/${dir.name}/mobile`));

        return acc;
    }, []);

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    projectRoot: __dirname,
    watchFolders: [
        path.resolve(root, 'node_modules'),
        path.resolve(root, 'packages'),
        path.resolve(root, 'ui/common'),
        path.resolve(root, 'ui/mobile'),
        ...gearsWatchFolders,
    ],
    resolver: {
        extraNodeModules: {
            react: path.resolve(root, "node_modules/react"),
            '@apparatus': path.resolve(root, 'packages/apparatus/src'),
            '@tinker-chest': path.resolve(root, 'packages/tinker-chest/src'),
            '@ui': path.resolve(root, 'ui/common/src'),
            '@mobile-ui': path.resolve(root, 'ui/mobile/src'),
            ...extraNodeModules
        },
        nodeModulesPaths: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(root, 'node_modules'),
        ]
    }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
