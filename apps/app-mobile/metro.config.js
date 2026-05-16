const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const gearsRoot = path.resolve(root, 'gears');

const gearsDirs = fs
    .readdirSync(gearsRoot, { withFileTypes: true })
    .filter((dir) => dir.isDirectory());

const gearsWatchFolders = gearsDirs
    .reduce((acc, dir) => {
        acc.push(path.resolve(root, `gears/${dir.name}/common`));
        acc.push(path.resolve(root, `gears/${dir.name}/mobile`));

        return acc;
    }, []);

const gearsExtraNodeModules = gearsDirs
    .reduce((acc, dir) => {
        acc[`@the-dead-planet/nav-gauge-gears-${dir.name}-common`] = path.resolve(root, `gears/${dir.name}/common/src`);
        acc[`@the-dead-planet/nav-gauge-gears-${dir.name}-mobile`] = path.resolve(root, `gears/${dir.name}/mobile/src`);

        return acc;
    }, {});

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
        path.resolve(root, 'apparatus/common'),
        path.resolve(root, 'apparatus/mobile'),
        path.resolve(root, 'tinker-chest'),
        path.resolve(root, 'ui/common'),
        path.resolve(root, 'ui/mobile'),
        ...gearsWatchFolders,
    ],
    transformer: {
        unstable_allowRequireContext: true,
    },
    resolver: {
        extraNodeModules: {
            react: path.resolve(root, "node_modules/react"),
            '@apparatus': path.resolve(root, 'apparatus/common/src'),
            '@mobile-apparatus': path.resolve(root, 'apparatus/mobile/src'),
            '@tinker-chest': path.resolve(root, 'tinker-chest/src'),
            '@ui': path.resolve(root, 'ui/common/src'),
            '@mobile-ui': path.resolve(root, 'ui/mobile/src'),
            ...gearsExtraNodeModules
        },
        nodeModulesPaths: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(root, 'node_modules'),
        ]
    }
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
