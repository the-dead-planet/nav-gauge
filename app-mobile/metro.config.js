const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const root = path.resolve(__dirname, '..');
const rnRoot = path.resolve(root, 'node_modules/react-native');
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
        babelTransformerPath: require.resolve(
            "react-native-svg-transformer/react-native"
        )
    },
    resolver: {
        assetExts: [...assetExts.filter((ext) => ext !== "svg"), "pmtiles"],
        sourceExts: [...sourceExts, "svg"],
        extraNodeModules: {
            react: path.resolve(root, "node_modules/react"),
            '@apparatus': path.resolve(root, 'apparatus/common/src'),
            '@mobile-apparatus': path.resolve(root, 'apparatus/mobile/src'),
            '@tinker-chest': path.resolve(root, 'tinker-chest/src'),
            '@ui': path.resolve(root, 'ui/common/src'),
            '@mobile-ui': path.resolve(root, 'ui/mobile/src'),
            ...gearsExtraNodeModules,
        },
        nodeModulesPaths: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(root, 'node_modules'),
        ],
        resolveRequest: (context, moduleName, platform) => {
            // RN 0.87 moved AssetRegistry but kept a stale exports map pointing to the old path
            if (moduleName === 'react-native/Libraries/Image/AssetRegistry') {
                return {
                    filePath: path.resolve(rnRoot, 'src/private/assets/AssetRegistry.js'),
                    type: 'sourceFile',
                };
            }
            return context.resolveRequest(context, moduleName, platform);
        },
    }
};

module.exports = mergeConfig(defaultConfig, config);
