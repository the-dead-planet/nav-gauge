import path from "path";
import fs from "fs";
import { merge } from "webpack-merge";
import rspack, { Configuration } from "@rspack/core";
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { baseConfig, Env, Argv } from "./rspack.config";

const gearsDir = path.resolve(__dirname, "../gears");
const gearNames = fs
    .readdirSync(gearsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && fs.existsSync(path.join(gearsDir, dirent.name, "web/src/index.ts")))
    .map((dirent) => dirent.name);

const config = (env: Env, argv: Argv): Configuration => {
    const base = baseConfig(env, argv);

    return merge(base, {
        mode: 'production',
        entry: {
            machine: path.resolve('./src/index.tsx')
        },
        target: 'web',
        module: Object.assign({}, base.module, {
            rules: [
                {
                    test: /\.module\.css$/,
                    exclude: /node_modules/,
                    type: 'javascript/auto',
                    use: [
                        {
                            loader: rspack.CssExtractRspackPlugin.loader,
                            options: {
                                esModule: true,
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                esModule: false,
                                modules: {
                                    mode: "local",
                                    localIdentName: "[hash:base64:5]",
                                    namedExport: false,
                                    exportLocalsConvention: "camelCase",
                                },
                                url: {
                                    filter: (url: string) => !url.startsWith("/"),
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    exclude: [/node_modules/, /\.module\.css$/],
                    type: 'javascript/auto',
                    use: [
                        {
                            loader: rspack.CssExtractRspackPlugin.loader,
                            options: {
                                esModule: false,
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                esModule: false,
                                modules: false,
                                url: {
                                    filter: (url: string) => !url.startsWith("/"),
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    include: /node_modules/,
                    use: [
                        'style-loader',
                        'css-loader',
                    ],
                },
            ]
        }),
        optimization: {
            moduleIds: 'deterministic',
            splitChunks: {
                chunks: "all",
                cacheGroups: {
                    react: {
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        name: 'vendors-react',
                        priority: 2
                    },
                    maplibre: {
                        test: /[\\/]node_modules[\\/](maplibre-gl|@maplibre[\\/]maplibre-gl-style-spec)[\\/]/,
                        name: 'vendors-maplibre',
                        priority: 2
                    },
                    node_modules: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors-node-modules',
                    },
                    apparatus: {
                        test: /[\\/]apparatus[\\/](common|web)[\\/]src[\\/]/,
                        name: 'apparatus',
                    },
                    ['tinker-chest']: {
                        test: /[\\/]tinker-chest[\\/]src[\\/]/,
                        name: 'tinker-chest',
                    },
                    ...(Object.fromEntries(
                        gearNames.map((gearName) => [
                            gearName + '-i18n',
                            {
                                test: new RegExp(`[\\\\/]gears[\\\\/]${gearName}[\\\\/](common|web)[\\\\/]src[\\\\/]translations[\\\\/]`),
                                name: `gear-${gearName}-i18n`,
                                priority: 5,
                            }
                        ])
                    )),
                    ...(Object.fromEntries(
                        gearNames.map((gearName) => [
                            gearName,
                            {
                                test: new RegExp(`[\\\\/]gears[\\\\/]${gearName}[\\\\/](common|web)[\\\\/]src[\\\\/]`),
                                name: `gear-${gearName}`,
                                minSize: 0,
                            }
                        ])
                    )),
                    ui: {
                        test: /[\\/]ui[\\/](common|web)[\\/]src[\\/]/,
                        name: 'ui',
                    },
                },
            },
        },
        plugins: [
            new rspack.CssExtractRspackPlugin({ filename: "[name].[contenthash].css" }),
            process.env.ANALYZE === 'true' && new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: false,
                reportFilename: 'bundle-report.html',
            })
        ].filter(Boolean),
        output: {
            publicPath: '/',
            filename: "[name].[contenthash].bundle.js",
            chunkFilename: '[name].[contenthash].bundle.js',
            path: path.resolve(__dirname, "dist"),
            clean: true
        },
    });
};

export default config;
