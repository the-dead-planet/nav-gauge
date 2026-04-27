import path from "path";
import rspack, { Configuration } from "@rspack/core";
import GearRegistryGenerator from "./rspack.gears";

export type Env = {
    production?: boolean;
    analyze?: boolean;
};

export type Argv = {
    mode?: 'development' | 'production' | 'none';
};

export const baseConfig = (_env: Env, _argv: Argv): Configuration => ({
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
        fallback: {
            url: require.resolve("url"),
        },
        alias: {
            '@apparatus': path.resolve(__dirname, '../packages/apparatus/src'),
            '@tinker-chest': path.resolve(__dirname, '../packages/tinker-chest/src'),
            '@ui': path.resolve(__dirname, '../ui/common/src'),
            '@web-ui': path.resolve(__dirname, '../ui/web/src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.[jt]s?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'typescript',
                                tsx: true,
                            },
                            transform: {
                                react: {
                                    runtime: 'automatic',
                                },
                            },
                        },
                    },
                },
            },
            {
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'builtin:swc-loader',
                        options: {
                            jsc: {
                                parser: {
                                    syntax: 'typescript',
                                    tsx: true,
                                },
                                transform: {
                                    react: {
                                        runtime: 'automatic',
                                    },
                                },
                            },
                        }
                    },
                    {
                        loader: 'babel-loader'
                    }
                ],
            },
            {
                test: /\.(json|xml|ttf|woff|woff2|otf|eot)$/,
                exclude: /node_modules/,
                type: "asset/resource",
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                exclude: /node_modules/,
                type: "asset/resource",
            },
            {
                test: /\.svg$/,
                issuer: /\.[jt]sx?$/,
                oneOf: [
                    {
                        resourceQuery: /react/,
                        use: [
                            {
                                loader: '@svgr/webpack',
                                options: {
                                    exportType: 'default',
                                },
                            },
                        ],
                    },
                    {
                        type: 'asset/resource',
                    },
                ],
            },
            {
                test: /\.m?js$/,
                type: 'javascript/auto',
                resolve: {
                    fullySpecified: false
                },
            },
        ],
    },
    plugins: [
        new GearRegistryGenerator(),
        new rspack.HtmlRspackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            favicon: "./public/favicon.ico",
            inject: 'body'
        }),
        new rspack.CopyRspackPlugin({
            patterns: [
                {
                    context: '../gears/',
                    from: '*/common/public/**/*',
                    to: '[name][ext]',
                    toType: 'template',
                    noErrorOnMissing: true,
                },
                {
                    context: '../gears/',
                    from: '*/web/public/**/*',
                    to: '[name][ext]',
                    toType: 'template',
                    noErrorOnMissing: true,
                },
                {
                    from: "./public",
                    to: './'
                },
            ],
        }),
    ],
    output: {
        uniqueName: 'app',
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        assetModuleFilename: 'static/[name]-[contenthash][ext][query]',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    }
});

export default baseConfig;
