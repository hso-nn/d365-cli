const path = require("path");
const webpack = require("webpack");
const dir_build = path.resolve(__dirname, "bin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const packageJson = require('./package.json');

module.exports = (env, argv) =>  {
    const mode = argv.mode;
    return {
        mode: mode,
        target: "node",
        node: {
            __dirname: false,
            __filename: false
        },
        externals: [nodeExternals()],
        entry: {
            "root/tools/resx": [
                path.resolve(__dirname, "src/root/tools/Resx.ts")
            ],
            "root/tools/setFormCustomizable": [
                path.resolve(__dirname, "src/root/tools/SetFormCustomizable.ts")
            ],
            "main": [
                path.resolve(__dirname, "src/main.ts")
            ]
        },
        output: {
            path: dir_build,
            filename: "[name].js"
        },
        resolve: {
            extensions: [".json", ".ts"]
        },
        module: {
            rules: [{
                test: /\.json$/,
                use: "json-loader"
            }, {
                test: /\.ts$/,
                enforce: "pre",
                use: [
                    {
                        loader: "eslint-loader",
                        options: {
                            failOnWarning: false,
                            failOnError: true
                        }
                    }
                ]
            }, {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }]
        },
        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new webpack.BannerPlugin(`HSO D365 CLI ${packageJson.version} | (c) HSO Innovation`),
        ].concat(mode === "development" ? [] : [
            new CopyWebpackPlugin({
                patterns:[{
                    from: "./root/**/*.json",
                    to: dir_build,
                    context: "src"
                }]
            }),
        ]),
        stats: {
            colors: true
        },
        optimization: {
            minimize: mode === "production",
            minimizer: [new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    compress: {
                        drop_console: mode === "production"
                    }
                }
            })]
        },
        devtool: mode === "development" ? "source-map" : false,
    }
};
