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
            '@apparatus': path.resolve(__dirname, '../apparatus/common/src'),
            '@web-apparatus': path.resolve(__dirname, '../apparatus/web/src'),
            '@tinker-chest': path.resolve(__dirname, '../tinker-chest/src'),
            '@ui': path.resolve(__dirname, '../ui/common/src'),
            '@web-ui': path.resolve(__dirname, '../ui/web/src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'typescript',
                                tsx: true,
                            },
                        },
                    },
                },
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'ecmascript',
                            },
                        },
                    },
                },
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
                        resourceQuery: /component/,
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
                        generator: {
                            filename: 'static/media/[name].[contenthash][ext]',
                        },
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
                    from: "../apparatus/common/public",
                    to: './'
                },
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
                {
                    context: '../ui/common/public',
                    from: '**/*',
                    to: '[path][name][ext]',
                    toType: 'template',
                    noErrorOnMissing: true,
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
