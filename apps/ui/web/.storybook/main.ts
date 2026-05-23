import type { StorybookConfig } from 'storybook-react-rsbuild';
import { mergeRsbuildConfig } from '@rsbuild/core';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
    framework: 'storybook-react-rsbuild',
    stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    staticDirs: [path.resolve(__dirname, '../../common/public')],
    addons: [],
    async rsbuildFinal(config) {
        return mergeRsbuildConfig(config, {
            resolve: {
                alias: {
                    '@ui': path.resolve(__dirname, '../../common/src'),
                },
            },
            tools: {
                cssLoader: {
                    url: {
                        filter: (url: string) => !url.startsWith('/'),
                    },
                    modules: {
                        auto: /\.module\.css$/,
                        mode: "local",
                        localIdentName: "[name]---[local]---[hash:base64:5]",
                    },
                },
            },
        });
    },
};

export default config;