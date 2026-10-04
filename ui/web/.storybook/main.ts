import type { StorybookConfig } from 'storybook-react-rsbuild';
import { mergeRsbuildConfig } from '@rsbuild/core';
import { getCodeEditorStaticDirs } from 'storybook-addon-code-editor/getStaticDirs';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

const config: StorybookConfig = {
    framework: 'storybook-react-rsbuild',
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    staticDirs: [path.resolve(__dirname, '../../common/public'), ...getCodeEditorStaticDirs(filename)],
    addons: ['@storybook/addon-docs', 'storybook-addon-code-editor'],
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
