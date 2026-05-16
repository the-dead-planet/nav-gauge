import { merge } from 'webpack-merge';
import path from "path";
import { TsCheckerRspackPlugin } from 'ts-checker-rspack-plugin';
import { ReactRefreshRspackPlugin } from "@rspack/plugin-react-refresh";
import { Configuration } from '@rspack/core';
import { baseConfig, Env, Argv } from './rspack.config';

const config = (env: Env, argv: Argv): Configuration => {
    const base = baseConfig(env, argv);

    return merge(base, {
        mode: 'development',
        devtool: 'source-map',
        entry: {
            machine: {
                import: path.resolve('./src/index.tsx'),
                dependOn: ['react-vendors']
            },
            apparatus: {
                import: path.resolve('../packages/apparatus/common/src/index.ts'),
                dependOn: ['react-vendors']
            },
            ['web-apparatus']: {
                import: path.resolve('../packages/apparatus/web/src/index.ts'),
                dependOn: ['react-vendors']
            },
            ['tinker-chest']: {
                import: path.resolve('../packages/tinker-chest/src/index.ts'),
                dependOn: ['react-vendors']
            },
            ui: {
                import: path.resolve('../ui/common/src/index.ts'),
                dependOn: ['react-vendors']
            },
            ['web-ui']: {
                import: path.resolve('../ui/web/src/index.ts'),
                dependOn: ['react-vendors']
            },
            'react-vendors': ['react', 'react-dom']
        },
        module: Object.assign({}, base.module, {
            rules: [
                {
                    test: /\.module\.css$/,
                    exclude: /node_modules/,
                    use: [
                        'style-loader',
                        {
                            loader: "css-loader",
                            options: {
                                esModule: false,
                                sourceMap: true,
                                modules: {
                                    mode: "local",
                                    localIdentName: "[name]---[local]---[hash:base64:5]",
                                    exportLocalsConvention: "camelCase",
                                    namedExport: false,
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    exclude: [/node_modules/, /\.module\.css$/],
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                modules: false,
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    include: /node_modules/,
                    use: ['style-loader', 'css-loader'],
                }
            ]
        }),
        stats: {
            errorDetails: true
        },
        plugins: [
            new ReactRefreshRspackPlugin({
                include: [/\.jsx$/, /\.tsx$/],
                exclude: [/node_modules/]
            }),
            new TsCheckerRspackPlugin(),
        ],
        devServer: {
            port: process.env.PORT || 3000,
            open: true,
            historyApiFallback: true,
            proxy: [
                {
                    context: ['/api'],
                    target: 'http://localhost:5000',
                    pathRewrite: { '^/api': '' },
                    secure: false,
                    changeOrigin: true,
                },
            ]
        },
    });
};

export default config;
